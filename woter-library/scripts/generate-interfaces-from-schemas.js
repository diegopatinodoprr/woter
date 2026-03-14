#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const inputPath = process.env.SCHEMAS_INPUT_PATH
  ? path.resolve(rootDir, process.env.SCHEMAS_INPUT_PATH)
  : path.join(rootDir, 'schemas', 'woterSchemas.json');
const outputDir = path.join(rootDir, 'src', 'interfaces', 'generated');

const SCALAR_TYPES = new Set(['string', 'number', 'boolean', 'date', 'objectid']);
const COMPLEX_TYPES = new Set(['enum', 'array', 'arrayof', 'object']);

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readEjsonNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (!isPlainObject(value)) {
    return null;
  }

  if (typeof value.$numberInt === 'string') return Number(value.$numberInt);
  if (typeof value.$numberLong === 'string') return Number(value.$numberLong);
  if (typeof value.$numberDouble === 'string') return Number(value.$numberDouble);
  if (typeof value.$numberDecimal === 'string') return Number(value.$numberDecimal);

  return null;
}

function toPascalCase(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('');
}

function toKebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function mapScalar(type) {
  if (type === 'date') return 'Date';
  if (type === 'objectid') return 'MongoObjectId';
  return type;
}

function toEnumType(values, ctx) {
  assert(Array.isArray(values) && values.length > 0, `${ctx}: enum.values must be a non-empty array`);
  const normalized = values.map((value) => {
    const valid = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    assert(valid, `${ctx}: enum value must be string | number | boolean`);
    return JSON.stringify(value);
  });
  return normalized.join(' | ');
}

function toArrayOfType(types, ctx) {
  assert(Array.isArray(types) && types.length > 0, `${ctx}: arrayOf.types must be a non-empty array`);

  const mapped = types.map((entry, index) => {
    if (typeof entry === 'string') {
      const normalized = entry.toLowerCase();
      assert(SCALAR_TYPES.has(normalized), `${ctx}.types[${index}]: unsupported scalar type "${entry}"`);
      return mapScalar(normalized);
    }

    const parsed = parseDescriptor(entry, `${ctx}.types[${index}]`);
    return parsed.type;
  });

  const unique = [...new Set(mapped)];
  if (unique.length === 1) {
    return `${unique[0]}[]`;
  }

  return `(${unique.join(' | ')})[]`;
}

function parseDescriptor(descriptor, ctx) {
  assert(isPlainObject(descriptor), `${ctx}: descriptor must be an object`);
  assert(typeof descriptor.type === 'string', `${ctx}: descriptor.type is required`);

  const type = descriptor.type.toLowerCase();
  const optional = Boolean(descriptor.optional);

  if (SCALAR_TYPES.has(type)) {
    return { type: mapScalar(type), optional };
  }

  if (type === 'enum') {
    return { type: toEnumType(descriptor.values, ctx), optional };
  }

  if (type === 'array') {
    assert(descriptor.items !== undefined, `${ctx}: array.items is required`);
    const items = parseDescriptor(descriptor.items, `${ctx}.items`);
    return { type: `${items.type}[]`, optional };
  }

  if (type === 'arrayof') {
    return { type: toArrayOfType(descriptor.types, ctx), optional };
  }

  if (type === 'object') {
    assert(isPlainObject(descriptor.fields), `${ctx}: object.fields is required and must be an object`);
    const objectType = parseFields(descriptor.fields, `${ctx}.fields`);
    return { type: objectType, optional };
  }

  assert(COMPLEX_TYPES.has(type) || SCALAR_TYPES.has(type), `${ctx}: unsupported type "${descriptor.type}"`);
  return { type: 'unknown', optional };
}

function parseFields(fields, ctx) {
  const entries = Object.entries(fields);
  if (!entries.length) {
    return 'Record<string, unknown>';
  }

  const props = entries.map(([key, descriptor]) => {
    const parsed = parseDescriptor(descriptor, `${ctx}.${key}`);
    const optionalMark = parsed.optional ? '?' : '';
    return `${key}${optionalMark}: ${parsed.type};`;
  });

  return `{ ${props.join(' ')} }`;
}

function validateSchemaDocument(document, index) {
  const ctx = `document[${index}]`;
  assert(isPlainObject(document), `${ctx}: must be an object`);
  assert(typeof document.name === 'string' && document.name.trim().length > 0, `${ctx}: name is required`);
  assert(isPlainObject(document.schema), `${ctx}: schema is required and must be an object`);
  assert(typeof document.isCollectionEnabled === 'boolean', `${ctx}: isCollectionEnabled must be a boolean`);

  if ('schemaVersion' in document) {
    const schemaVersion = readEjsonNumber(document.schemaVersion);
    assert(schemaVersion !== null && Number.isInteger(schemaVersion), `${ctx}: schemaVersion must be an integer`);
  }

  parseFields(document.schema, `${ctx}.schema`);

  return {
    name: document.name,
    schema: document.schema
  };
}

function buildInterfaceCode(schemaDoc) {
  const interfaceName = `I${toPascalCase(schemaDoc.name)}`;
  const bodyType = parseFields(schemaDoc.schema, `schema(${schemaDoc.name})`);
  const body = bodyType.slice(1, -1).trim();
  const formattedBody = body ? body.split('; ').join(';\n  ') : '';

  return {
    interfaceName,
    code: `/* eslint-disable */\n/* auto-generated by scripts/generate-interfaces-from-schemas.js */\n\nimport type { MongoObjectId } from './types.js';\n\nexport interface ${interfaceName} {\n  ${formattedBody}\n}\n`
  };
}

function writeTypesFile() {
  const typesPath = path.join(outputDir, 'types.ts');
  const content = `/* eslint-disable */\n/* auto-generated by scripts/generate-interfaces-from-schemas.js */\n\nexport type MongoObjectId = string;\n`;
  fs.writeFileSync(typesPath, content, 'utf8');
}

function cleanGeneratedDirectory() {
  fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(outputDir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      fs.rmSync(path.join(outputDir, file));
    }
  }
}

function run() {
  assert(fs.existsSync(inputPath), `Input file not found: ${inputPath}`);

  const raw = fs.readFileSync(inputPath, 'utf8');
  const parsed = JSON.parse(raw);
  assert(Array.isArray(parsed), 'Input JSON must be an array');

  const schemas = parsed.map((document, index) => validateSchemaDocument(document, index));
  const built = schemas.map((schemaDoc) => buildInterfaceCode(schemaDoc));

  cleanGeneratedDirectory();
  writeTypesFile();

  const exportLines = [`export type { MongoObjectId } from './types.js';`];

  for (const schema of built) {
    const filename = `${toKebabCase(schema.interfaceName.replace(/^I/, ''))}.ts`;
    fs.writeFileSync(path.join(outputDir, filename), schema.code, 'utf8');
    exportLines.push(`export type { ${schema.interfaceName} } from './${filename.replace(/\.ts$/, '.js')}';`);
  }

  const indexContent = `/* eslint-disable */\n/* auto-generated by scripts/generate-interfaces-from-schemas.js */\n\n${exportLines.join('\n')}\n`;
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent, 'utf8');

  console.log(`Generated ${built.length} interface file(s) + index in ${outputDir} from ${inputPath}`);
}

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
