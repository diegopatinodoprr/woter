# Woter

Woter is a platform to locate and find water points to cool off in any city worldwide. Users can also add new water points.

Woter is composed of three projects:

- `woter-frontend`: public web app (Angular)
- `woter-admin`: admin web app (Angular)
- `woter-api`: backend API (Node.js/TypeScript)

A shared library provides common interfaces and services:

- `woter-library`

## Quick start

Install dependencies:

```bash
cd woter-library && npm install && npm run build
cd ../woter-frontend && npm install
cd ../woter-admin && npm install
cd ../woter-api && npm install
```

Run API:

```bash
cd woter-api
npm run dev
```

Run frontends:

```bash
cd woter-frontend
npm start
```

```bash
cd woter-admin
npm start
```

## Notes

- API base path: `/api/v1`
- Auth routes: `/api/v1/authentication`
