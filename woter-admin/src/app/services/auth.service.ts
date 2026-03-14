import type { IAuthLoginRequest, IAuthTokens } from '@diegopatinodoprr/woter-library';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  data: T;
}

type LoginType = 'client' | 'admin';

type AuthLoginPayload = IAuthLoginRequest & {
  type: LoginType;
};

export class AuthApiService {
  private readonly storageKey = 'woter-admin-auth';

  constructor(private readonly baseUrl = `${environment.apiUrl}/api/v1/authentication`) {}

  async loginAsAdmin(payload: IAuthLoginRequest): Promise<IAuthTokens> {
    const requestPayload: AuthLoginPayload = {
      ...payload,
      type: 'admin'
    };

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error('LOGIN_FAILED');
    }

    const body = (await response.json()) as ApiResponse<IAuthTokens>;
    this.setTokens(body.data);
    return body.data;
  }

  getTokens(): IAuthTokens | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as IAuthTokens;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  hasAccessToken(): boolean {
    const tokens = this.getTokens();
    return Boolean(tokens?.accessToken);
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken ?? null;
  }

  getConnectedUserName(): string {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return 'Admin';
    }

    const payload = this.readJwtPayload(accessToken);
    if (!payload || typeof payload !== 'object') {
      return 'Admin';
    }

    const nameValue = payload['name'];
    if (typeof nameValue === 'string' && nameValue.trim()) {
      return nameValue.trim();
    }

    const emailValue = payload['email'];
    if (typeof emailValue === 'string' && emailValue.trim()) {
      return emailValue.split('@')[0] || emailValue;
    }

    return 'Admin';
  }

  clearTokens(): void {
    localStorage.removeItem(this.storageKey);
  }

  private setTokens(tokens: IAuthTokens): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tokens));
  }

  private readJwtPayload(token: string): Record<string, unknown> | null {
    const segments = token.split('.');
    if (segments.length < 2) {
      return null;
    }

    try {
      const payloadSegment = segments[1].replace(/-/g, '+').replace(/_/g, '/');
      const normalized = payloadSegment.padEnd(payloadSegment.length + ((4 - (payloadSegment.length % 4)) % 4), '=');
      const decoded = atob(normalized);
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
