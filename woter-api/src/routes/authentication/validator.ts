import type { services } from "@diegopatinodoprr/woter-library";

export function validateLogin(body: services.IAuthLoginRequest) {
  const loginBody = body as services.IAuthLoginRequest & { type?: "client" | "admin" };
  if (!loginBody?.email || !loginBody?.password) {
    return "email, password and type are required";
  }
  if (!loginBody.type) {
    return "email, password and type are required";
  }
  if (loginBody.type !== "client" && loginBody.type !== "admin") {
    return "type must be client or admin";
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
