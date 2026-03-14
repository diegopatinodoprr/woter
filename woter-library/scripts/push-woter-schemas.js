#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const rootDir = path.resolve(__dirname, '..');
const seedPath = process.env.SCHEMAS_SEED_PATH
  ? path.resolve(rootDir, process.env.SCHEMAS_SEED_PATH)
  : path.join(rootDir, 'schemas', 'woterSchemas.seed.json');

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function loadSeedDocuments() {
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found: ${seedPath}`);
  }

  const raw = fs.readFileSync(seedPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Seed JSON must be an array');
  }

  for (const [index, doc] of parsed.entries()) {
    if (!doc || typeof doc !== 'object') {
      throw new Error(`Seed document at index ${index} must be an object`);
    }
    if (typeof doc.name !== 'string' || !doc.name.trim()) {
      throw new Error(`Seed document at index ${index} is missing a valid "name"`);
    }
  }

  return parsed;
}

async function run() {
  const mongoUrl = getRequiredEnv('MONGO_BDD_URL');
  const dbName = process.env.MONGO_DATABASE_NAME || process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error('Missing environment variable: MONGO_DATABASE_NAME (or MONGO_DB_NAME)');
  }

  const seedDocuments = loadSeedDocuments();
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const collection = client.db(dbName).collection('woterSchemas');

    let matchedCount = 0;
    let modifiedCount = 0;
    let upsertedCount = 0;

    for (const schemaDoc of seedDocuments) {
      const result = await collection.replaceOne(
        { name: schemaDoc.name },
        schemaDoc,
        { upsert: true }
      );

      matchedCount += result.matchedCount;
      modifiedCount += result.modifiedCount;
      upsertedCount += result.upsertedCount;
    }

    console.log(
      `Pushed ${seedDocuments.length} schema(s) to woterSchemas (matched=${matchedCount}, modified=${modifiedCount}, upserted=${upsertedCount})`
    );
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
