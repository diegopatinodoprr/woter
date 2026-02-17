import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthRefreshRequest,
} from "woter-library";

export function validateLogin(body: AuthLoginRequest) {
  if (!body?.email || !body?.password) {
    return "email and password are required";
  }
  return null;
}

export function validateRegister(body: AuthRegisterRequest) {
  if (!body?.email || !body?.password) {
    return "email and password are required";
  }
  return null;
}

export function validateRefresh(body: AuthRefreshRequest) {
  if (!body?.refreshToken) {
    return "refreshToken is required";
  }
  return null;
}
