import type { IAuthLoginRequest, IAuthLoginResponse } from '@diegopatinodoprr/woter-library';

interface IApiResponse<T> {
  data: T;
}

export class AuthenticationApiService {
  constructor(private readonly baseUrl = '/api/v1/authentication') {}

  async login(payload: IAuthLoginRequest): Promise<IAuthLoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AUTH_LOGIN_FAILED_${response.status}`);
    }

    const body = (await response.json()) as IApiResponse<IAuthLoginResponse>;
    return body.data;
  }
}
