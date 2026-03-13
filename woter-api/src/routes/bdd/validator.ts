import type {
  interfaces,
  services,
} from "@diegopatinodoprr/woter-library";

function isObject(value: unknown): value is interfaces.IMongoDocument {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValidCollectionName(collectionName: unknown): boolean {
  return typeof collectionName === "string" && collectionName.trim().length > 0;
}

export function validateCreateObject(body: services.IBddCreateObjectRequest): string | null {
  if (!hasValidCollectionName(body?.collectionName)) {
    return "collectionName is required";
  }
  if (!isObject(body?.document)) {
    return "document must be an object";
  }
  return null;
}

export function validateCreateObjects(body: services.IBddCreateObjectsRequest): string | null {
  if (!hasValidCollectionName(body?.collectionName)) {
    return "collectionName is required";
  }
  if (!Array.isArray(body?.documents) || body.documents.length === 0) {
    return "documents must be a non-empty array";
  }
  if (!body.documents.every((document) => isObject(document))) {
    return "each document must be an object";
  }
  return null;
}

export function validateSearchObject(body: services.IBddSearchObjectRequest): string | null {
  if (!hasValidCollectionName(body?.collectionName)) {
    return "collectionName is required";
  }
  if (!isObject(body?.filter)) {
    return "filter must be an object";
  }
  return null;
}

export function validateSearchObjects(body: services.IBddSearchObjectsRequest): string | null {
  return validateSearchObject(body);
}

export function validateUpdateObject(body: services.IBddUpdateObjectRequest): string | null {
  if (!hasValidCollectionName(body?.collectionName)) {
    return "collectionName is required";
  }
  if (!isObject(body?.filter)) {
    return "filter must be an object";
  }
  if (!isObject(body?.update)) {
    return "update must be an object";
  }
  return null;
}

export function validateUpdateObjects(body: services.IBddUpdateObjectsRequest): string | null {
  return validateUpdateObject(body);
}

export function validateDeleteObject(body: services.IBddDeleteObjectRequest): string | null {
  if (!hasValidCollectionName(body?.collectionName)) {
    return "collectionName is required";
  }
  if (!isObject(body?.filter)) {
    return "filter must be an object";
  }
  return null;
}

export function validateDeleteObjects(body: services.IBddDeleteObjectsRequest): string | null {
  return validateDeleteObject(body);
}
