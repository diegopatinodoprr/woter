import type {
  IAuthLoginRequest,
  IAuthRegisterRequest,
  IAuthRefreshRequest,
} from '@diegopatinodoprr/woter-library';

export function validateLogin(body: IAuthLoginRequest) {
  if (!body?.email || !body?.password) {
    return 'email and password are required';
  }
  return null;
}

export function validateRegister(body: IAuthRegisterRequest) {
  if (!body?.email || !body?.password) {
    return 'email and password are required';
  }
  return null;
}

export function validateRefresh(body: IAuthRefreshRequest) {
  if (!body?.refreshToken) {
    return 'refreshToken is required';
  }
  return null;
}
