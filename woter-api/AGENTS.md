# Woter API - Route Rules

## Purpose
This file defines the rules to follow when creating or updating API routes for Woter.

## Route Folder Structure (Required)
- For each new route, create a folder named after the route.
- Inside the folder, create these files:
  - `router.ts`
  - `service.ts`
  - `domain-adapter.ts`
  - `component.ts`

## Component Rule
- The `component.ts` file must instantiate the other files/classes in its constructor and wire them together.

## General Principles
- Keep routes RESTful and resource-oriented.
- Prefer plural nouns for resources: `/users`, `/products`.
- Use nouns for resources, verbs only for actions that are not CRUD: `/auth/login`.
- Version the API using a prefix: `/api/v1`.
- All responses must be JSON.
- Always validate inputs at the edge (params, query, body).
- Never expose internal errors or stack traces in responses.

## Request & Response
- Use standard HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- `POST` creates a resource; `PUT` replaces; `PATCH` partially updates.
- Use proper status codes:
  - `200` OK
  - `201` Created
  - `204` No Content
  - `400` Bad Request
  - `401` Unauthorized
  - `403` Forbidden
  - `404` Not Found
  - `409` Conflict
  - `422` Unprocessable Entity
  - `500` Internal Server Error
- Errors must follow this shape:
  ```json
  {"error": {"code": "SOME_CODE", "message": "Human readable"}}
  ```
- Success responses must wrap data:
  ```json
  {"data": {}}
  ```

## Routing Conventions
- Base path: `/api/v1`.
- Route folders live in `src/routes` and are grouped by domain.
- Each domain route folder exports a router and is mounted in `src/server.ts`.
- Middlewares live in `src/middlewares`.
- Validators live in `src/validators`.

## Auth & Security
- Protect private routes with auth middleware.
- Use JWT for access tokens.
- Refresh tokens are stored server-side (db or cache) and rotated.
- Rate-limit auth endpoints.
- Use CORS and secure headers.

## Logging & Observability
- Log every request with method, path, status, duration, request-id.
- Errors must be logged with stack trace on server only.

## Examples
- `POST /api/v1/auth/login`
- `GET /api/v1/users/{id}`
- `PATCH /api/v1/users/{id}`
