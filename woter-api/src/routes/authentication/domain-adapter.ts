import type {
  IAuthLoginRequest,
  IAuthLoginResponse,
  IAuthRegisterRequest,
  IAuthRegisterResponse,
  IAuthRefreshRequest,
  IAuthRefreshResponse,
  IAuthTokens,
} from '@diegopatinodoprr/woter-library';

export class AuthenticationDomainAdapter {
  toLoginRequest(body: unknown): IAuthLoginRequest {
    return body as IAuthLoginRequest;
  }

  toRegisterRequest(body: unknown): IAuthRegisterRequest {
    return body as IAuthRegisterRequest;
  }

  toRefreshRequest(body: unknown): IAuthRefreshRequest {
    return body as IAuthRefreshRequest;
  }

  toLoginResponse(user: { id: string; email: string; role: 'user' | 'admin' }, tokens: IAuthTokens): IAuthLoginResponse {
    return { user, tokens };
  }

  toRegisterResponse(user: { id: string; email: string; role: 'user' | 'admin'; name?: string }, tokens: IAuthTokens): IAuthRegisterResponse {
    return { user, tokens };
  }

  toRefreshResponse(tokens: IAuthTokens): IAuthRefreshResponse {
    return { tokens };
  }
}
