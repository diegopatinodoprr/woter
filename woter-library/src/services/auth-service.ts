export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // seconds
}

export interface IAuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

export interface IAuthLoginRequest {
  email: string;
  password: string;
}

export interface IAuthLoginResponse {
  user: IAuthUser;
  tokens: IAuthTokens;
}

export interface IAuthRegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface IAuthRegisterResponse {
  user: IAuthUser;
  tokens: IAuthTokens;
}

export interface IAuthRefreshRequest {
  refreshToken: string;
}

export interface IAuthRefreshResponse {
  tokens: IAuthTokens;
}
