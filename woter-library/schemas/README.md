# woterSchemas - Format standard

Chaque document de la collection Mongo `woterSchemas` doit suivre ce format:

```json
{
  "name": "UserClient",
  "collectionName": "userclients",
  "isCollectionEnabled": true,
  "schemaVersion": 1,
  "schema": {
    "_id": { "type": "objectId" },
    "email": { "type": "string" },
    "role": { "type": "enum", "values": ["client", "admin"] },
    "name": { "type": "string", "optional": true },
    "createdAt": { "type": "date" },
    "updatedAt": { "type": "date" },
    "lastConnectionDate": { "type": "date", "optional": true }
  }
}
```

## Types supportes
- `string`
- `number`
- `boolean`
- `date` -> `Date`
- `objectId` -> `MongoObjectId`
- `enum` (avec `values`)
- `array` (avec `items`)
- `arrayOf` (avec `types`, liste de types)
- `object` (avec `fields`)

Exemple `arrayOf`:

```json
{
  "tagsOrIds": {
    "type": "arrayOf",
    "types": ["string", { "type": "objectId" }]
  }
}
```

## Notes
- `name` devient le nom d'interface TypeScript (`I${PascalCase(name)}`).
- `isCollectionEnabled` (boolean) indique si ce schema doit correspondre a une collection Mongo alimentee.
- `optional: true` genere un champ optionnel (`?`).
- Le script de generation refuse les documents qui ne respectent pas ce format.
- La generation produit un fichier par schema dans `src/interfaces/generated/` plus un `index.ts` auto-mis a jour.

## Workflow conseille
1. Mettre a jour `schemas/woterSchemas.seed.json`
2. Generer les interfaces depuis le seed:
   - `npm run schemas:generate:seed`
3. Pousser les schemas dans Mongo (upsert par `name`):
   - `npm run schemas:push`
4. Re-exporter depuis Mongo et regenerer:
   - `npm run schemas:sync`

Ou en une seule commande:
- `npm run schemas:apply`
