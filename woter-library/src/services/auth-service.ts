import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
} from "../interfaces/auth";
import { ServiceBase } from "./service-base";

export class AuthService extends ServiceBase {
  login(payload: AuthLoginRequest) {
    return this.post<AuthLoginResponse>("/auth/login", payload);
  }

  register(payload: AuthRegisterRequest) {
    return this.post<AuthRegisterResponse>("/auth/register", payload);
  }

  refresh(payload: AuthRefreshRequest) {
    return this.post<AuthRefreshResponse>("/auth/refresh", payload);
  }
}
