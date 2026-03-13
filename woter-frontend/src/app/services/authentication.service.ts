import type {
  IAuthLoginRequest,
  IAuthLoginResponse,
  IAuthRefreshRequest,
  IAuthRefreshResponse,
  IAuthRegisterRequest,
  IAuthRegisterResponse
} from '@diegopatinodoprr/woter-library';

interface IApiResponse<T> {
  data: T;
}

interface IApiErrorResponse {
  error?: string;
}

export class AuthenticationApiService {
  private readonly accessTokenStorageKey = 'woter_access_token';
  private readonly refreshTokenStorageKey = 'woter_refresh_token';

  constructor(private readonly baseUrl = '/api/v1/authentication') {}

  async login(payload: IAuthLoginRequest): Promise<IAuthLoginResponse> {
    const response = await fetch(this.getEndpointUrl('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await this.extractData<IAuthLoginResponse>(response);
    this.saveTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  async register(payload: IAuthRegisterRequest): Promise<IAuthRegisterResponse> {
    const response = await fetch(this.getEndpointUrl('register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await this.extractData<IAuthRegisterResponse>(response);
    this.saveTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  async refresh(refreshToken?: string): Promise<IAuthRefreshResponse> {
    const token = refreshToken ?? this.getRefreshToken();

    if (!token) {
      throw new Error('AUTH_REFRESH_TOKEN_MISSING');
    }

    const payload: IAuthRefreshRequest = { refreshToken: token };
    const response = await fetch(this.getEndpointUrl('refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await this.extractData<IAuthRefreshResponse>(response);
    this.saveTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenStorageKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.accessTokenStorageKey);
    localStorage.removeItem(this.refreshTokenStorageKey);
  }

  private saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.accessTokenStorageKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenStorageKey, refreshToken);
    }
  }

  private getEndpointUrl(path: 'login' | 'register' | 'refresh'): string {
    return `${this.baseUrl}/${path}`;
  }

  private async extractData<T>(response: Response): Promise<T> {
    const body = (await response.json()) as IApiResponse<T> | IApiErrorResponse;

    if (!response.ok) {
      const errorMessage = 'error' in body && body.error ? body.error : `AUTH_API_FAILED_${response.status}`;
      throw new Error(errorMessage);
    }

    return (body as IApiResponse<T>).data;
  }
}
