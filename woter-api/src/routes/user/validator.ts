import type { IAddUserFavoriteCitiesRequest, IUpdateUserInfoRequest } from 'woter-library';

export function validateUpdateInfo(body: IUpdateUserInfoRequest) {
  if (!body?.userId) {
    return 'userId is required';
  }

  if (body.email === undefined && body.name === undefined) {
    return 'email or name is required';
  }

  return null;
}

export function validateAddFavoriteCities(body: IAddUserFavoriteCitiesRequest) {
  if (!body?.userId) {
    return 'userId is required';
  }

  if (!Array.isArray(body.cities) || body.cities.length === 0) {
    return 'cities must be a non-empty array';
  }

  return null;
}
