import type { services } from "@diegopatinodoprr/woter-library";

export function validateUpdateInfo(body: services.IUpdateUserInfoRequest) {
  if (!body?.userId) {
    return "userId is required";
  }

  if (body.email === undefined && body.name === undefined) {
    return "email or name is required";
  }

  return null;
}

export function validateAddFavoriteCities(body: services.IAddUserFavoriteCitiesRequest) {
  if (!body?.userId) {
    return "userId is required";
  }

  if (!Array.isArray(body.cities) || body.cities.length === 0) {
    return "cities must be a non-empty array";
  }

  return null;
}
