import type { services } from "@diegopatinodoprr/woter-library";

export class AuthenticationDomainAdapter {
  toLoginRequest(body: unknown): services.IAuthLoginRequest {
    return body as services.IAuthLoginRequest;
  }

  toRegisterRequest(body: unknown): services.IAuthRegisterRequest {
    return body as services.IAuthRegisterRequest;
  }

  toRefreshRequest(body: unknown): services.IAuthRefreshRequest {
    return body as services.IAuthRefreshRequest;
  }

  toLoginResponse(
    user: { id: string; email: string; role: "user" | "admin" },
    tokens: services.IAuthTokens
  ): services.IAuthLoginResponse {
    return { user, tokens };
  }

  toRegisterResponse(
    user: { id: string; email: string; role: "user" | "admin"; name?: string },
    tokens: services.IAuthTokens
  ): services.IAuthRegisterResponse {
    return { user, tokens };
  }

  toRefreshResponse(tokens: services.IAuthTokens): services.IAuthRefreshResponse {
    return { tokens };
  }
}
