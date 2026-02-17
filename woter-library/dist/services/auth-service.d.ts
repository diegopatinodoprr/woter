import type { AuthLoginRequest, AuthLoginResponse, AuthRegisterRequest, AuthRegisterResponse, AuthRefreshRequest, AuthRefreshResponse } from "../interfaces/auth";
import { ServiceBase } from "./service-base";
export declare class AuthService extends ServiceBase {
    login(payload: AuthLoginRequest): Promise<AuthLoginResponse>;
    register(payload: AuthRegisterRequest): Promise<AuthRegisterResponse>;
    refresh(payload: AuthRefreshRequest): Promise<AuthRefreshResponse>;
}
//# sourceMappingURL=auth-service.d.ts.map