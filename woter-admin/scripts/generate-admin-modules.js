#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const adminRoot = path.resolve(__dirname, '..');
const templatesDir = path.join(adminRoot, 'templates');
const generatedRoot = path.join(adminRoot, 'src', 'app', 'generated');
const schemasCandidates = [
  path.join(adminRoot, '..', 'woter-library', 'schemas', 'woterSchemas.seed.json'),
  path.join(adminRoot, '..', 'woter-library', 'schemas', 'woterSchemas.json')
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal ? `${pascal[0].toLowerCase()}${pascal.slice(1)}` : 'schemaModule';
}

function toKebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

function humanize(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function resolveSchemasPath() {
  for (const candidate of schemasCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Unable to find woter schemas file in woter-library/schemas');
}

function normalizeType(descriptor) {
  if (!isObject(descriptor) || typeof descriptor.type !== 'string') {
    return 'string';
  }

  const type = descriptor.type;
  if (type === 'objectId') return 'objectId';
  if (type === 'arrayOf') return 'arrayOf';
  if (['string', 'number', 'boolean', 'date', 'enum', 'array', 'object'].includes(type)) {
    return type;
  }

  return 'string';
}

function buildFields(schemaDoc) {
  const schema = isObject(schemaDoc.schema) ? schemaDoc.schema : {};
  const entries = Object.entries(schema);

  return entries
    .filter(([key]) => key !== '_id')
    .map(([key, descriptor]) => {
      const type = normalizeType(descriptor);
      const enumValues = type === 'enum' && Array.isArray(descriptor.values) ? descriptor.values : [];

      return {
        key,
        label: humanize(key),
        type,
        enumValues,
        readonly: key === 'createdAt' || key === 'updatedAt',
      };
    });
}

function renderTemplate(templatePath, data) {
  const source = fs.readFileSync(templatePath, 'utf8');
  return ejs.render(source, data);
}

function renderFieldBlock(field) {
  const templatePath = path.join(templatesDir, 'fields', `${field.type}.ejs`);
  const fallbackPath = path.join(templatesDir, 'fields', 'string.ejs');
  const finalPath = fs.existsSync(templatePath) ? templatePath : fallbackPath;
  return renderTemplate(finalPath, { field });
}

function cleanGeneratedRoot() {
  fs.mkdirSync(generatedRoot, { recursive: true });

  for (const entry of fs.readdirSync(generatedRoot)) {
    const fullPath = path.join(generatedRoot, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      continue;
    }

    if (entry.endsWith('.ts')) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function generateSchemaModule(schemaDoc) {
  const schemaName = schemaDoc.name;
  const pascalName = toPascalCase(schemaName);
  const camelName = toCamelCase(schemaName);
  const kebabName = toKebabCase(camelName);
  const className = `${pascalName}ModuleComponent`;
  const collectionName = schemaDoc.collectionName || '';

  const fields = buildFields(schemaDoc);
  const primaryField = fields.find((field) => field.type === 'string')?.key || fields[0]?.key || '_id';

  const formControls = fields
    .map((field) => {
      if (field.type === 'boolean') return `    ${field.key}: [false],`;
      if (field.type === 'number') return `    ${field.key}: [0],`;
      return `    ${field.key}: [''],`;
    })
    .join('\n');

  const fieldBlocks = fields
    .map((field) => renderFieldBlock(field))
    .join('\n\n');

  const data = {
    schemaName,
    className,
    camelName,
    kebabName,
    collectionName,
    primaryField,
    fieldsJson: JSON.stringify(fields, null, 2),
    formControls,
    fieldBlocks,
  };

  const moduleDir = path.join(generatedRoot, camelName);
  fs.mkdirSync(moduleDir, { recursive: true });

  const ts = renderTemplate(path.join(templatesDir, 'module', 'component.ts.ejs'), data);
  const html = renderTemplate(path.join(templatesDir, 'module', 'component.html.ejs'), data);
  const css = renderTemplate(path.join(templatesDir, 'module', 'component.css.ejs'), data);

  fs.writeFileSync(path.join(moduleDir, `${kebabName}.module.component.ts`), ts, 'utf8');
  fs.writeFileSync(path.join(moduleDir, `${kebabName}.module.component.html`), html, 'utf8');
  fs.writeFileSync(path.join(moduleDir, `${kebabName}.module.component.css`), css, 'utf8');

  return {
    schemaName,
    camelName,
    className,
    importPath: `./${camelName}/${kebabName}.module.component`,
    collectionName,
  };
}

function writeRegistry(modules) {
  const imports = modules
    .map((mod) => `import { ${mod.className} } from '${mod.importPath}';`)
    .join('\n');

  const items = modules
    .map(
      (mod) =>
        `  { key: '${mod.camelName}', label: '${mod.schemaName}', collectionName: '${mod.collectionName}', component: ${mod.className} },`
    )
    .join('\n');

  const content = `/* eslint-disable */\n/* auto-generated by scripts/generate-admin-modules.js */\n\nimport type { Type } from '@angular/core';\n${imports ? `\n${imports}\n` : '\n'}\nexport interface GeneratedModuleItem {\n  key: string;\n  label: string;\n  collectionName: string;\n  component: Type<unknown>;\n}\n\nexport const GENERATED_MODULES: GeneratedModuleItem[] = [\n${items}\n];\n`;

  fs.writeFileSync(path.join(generatedRoot, 'registry.ts'), content, 'utf8');
}

function run() {
  const schemasPath = resolveSchemasPath();
  const parsed = readJson(schemasPath);
  assert(Array.isArray(parsed), 'woterSchemas JSON must be an array');

  const enabledSchemas = parsed.filter(
    (schemaDoc) => isObject(schemaDoc) && schemaDoc.isCollectionEnabled === true && typeof schemaDoc.name === 'string'
  );

  cleanGeneratedRoot();
  const generated = enabledSchemas.map((schemaDoc) => generateSchemaModule(schemaDoc));
  writeRegistry(generated);

  console.log(`Generated ${generated.length} admin module(s) from ${schemasPath}`);
}

run();
