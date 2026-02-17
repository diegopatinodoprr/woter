export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}
export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    role: "user" | "admin";
}
export interface AuthLoginRequest {
    email: string;
    password: string;
}
export interface AuthLoginResponse {
    user: AuthUser;
    tokens: AuthTokens;
}
export interface AuthRegisterRequest {
    email: string;
    password: string;
    name?: string;
}
export interface AuthRegisterResponse {
    user: AuthUser;
    tokens: AuthTokens;
}
export interface AuthRefreshRequest {
    refreshToken: string;
}
export interface AuthRefreshResponse {
    tokens: AuthTokens;
}
//# sourceMappingURL=auth.d.ts.map