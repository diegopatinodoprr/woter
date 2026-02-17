import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthTokens,
} from "woter-library";

export class AuthenticationDomainAdapter {
  toLoginRequest(body: unknown): AuthLoginRequest {
    return body as AuthLoginRequest;
  }

  toRegisterRequest(body: unknown): AuthRegisterRequest {
    return body as AuthRegisterRequest;
  }

  toRefreshRequest(body: unknown): AuthRefreshRequest {
    return body as AuthRefreshRequest;
  }

  toLoginResponse(user: { id: string; email: string; role: "user" | "admin" }, tokens: AuthTokens): AuthLoginResponse {
    return { user, tokens };
  }

  toRegisterResponse(user: { id: string; email: string; role: "user" | "admin"; name?: string }, tokens: AuthTokens): AuthRegisterResponse {
    return { user, tokens };
  }

  toRefreshResponse(tokens: AuthTokens): AuthRefreshResponse {
    return { tokens };
  }
}
