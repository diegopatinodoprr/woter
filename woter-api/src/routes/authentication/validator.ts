import type { services } from "@diegopatinodoprr/woter-library";

export function validateLogin(body: services.IAuthLoginRequest) {
  if (!body?.email || !body?.password) {
    return "email and password are required";
  }
  return null;
}

export function validateRegister(body: services.IAuthRegisterRequest) {
  if (!body?.email || !body?.password) {
    return "email and password are required";
  }
  return null;
}

export function validateRefresh(body: services.IAuthRefreshRequest) {
  if (!body?.refreshToken) {
    return "refreshToken is required";
  }
  return null;
}
