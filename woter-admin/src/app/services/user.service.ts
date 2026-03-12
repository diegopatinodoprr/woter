import type {
  IAddUserFavoriteCitiesRequest,
  IAddUserFavoriteCitiesResponse,
  IUpdateUserInfoRequest,
  IUpdateUserInfoResponse,
} from '@diegopatinodoprr/woter-library';

interface ApiResponse<T> {
  data: T;
}

export class UserApiService {
  constructor(private readonly baseUrl = '/api/v1/user') {}

  async updateInfo(payload: IUpdateUserInfoRequest): Promise<IUpdateUserInfoResponse> {
    const response = await fetch(`${this.baseUrl}/info`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return this.extractData<IUpdateUserInfoResponse>(response);
  }

  async addFavoriteCities(payload: IAddUserFavoriteCitiesRequest): Promise<IAddUserFavoriteCitiesResponse> {
    const response = await fetch(`${this.baseUrl}/favorite-cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return this.extractData<IAddUserFavoriteCitiesResponse>(response);
  }

  private async extractData<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const body = (await response.json()) as ApiResponse<T>;
    return body.data;
  }
}
