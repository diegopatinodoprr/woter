#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MongoClient, BSON } = require('mongodb');

const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'schemas', 'woterSchemas.json');

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function run() {
  const mongoUrl = getRequiredEnv('MONGO_BDD_URL');
  const dbName = process.env.MONGO_DATABASE_NAME || process.env.MONGO_DB_NAME;

  if (!dbName) {
    throw new Error('Missing environment variable: MONGO_DATABASE_NAME (or MONGO_DB_NAME)');
  }

  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const collection = client.db(dbName).collection('woterSchemas');
    const docs = await collection.find({}).toArray();

    const serialized = docs.map((doc) => BSON.EJSON.serialize(doc, { relaxed: false }));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(serialized, null, 2)}\n`, 'utf8');

    console.log(`Exported ${serialized.length} schema(s) to ${outputPath}`);
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
