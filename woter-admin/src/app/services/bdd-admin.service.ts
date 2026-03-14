import { Injectable } from '@angular/core';
import type { IBddPrevieResponse } from '@diegopatinodoprr/woter-library';
import { environment } from '../../environments/environment';
import { AuthApiService } from './auth.service';

interface ApiResponse<T> {
  data: T;
}

interface SearchObjectsResponse {
  documents: Record<string, unknown>[];
}

interface UpdateObjectResponse {
  modifiedCount: number;
}

interface CreateObjectResponse {
  insertedId: string;
}

@Injectable({ providedIn: 'root' })
export class BddAdminService {
  private readonly authService = new AuthApiService();
  private readonly baseUrl = `${environment.apiUrl}/api/v1/bdd`;

  constructor() {}

  async searchObjects(collectionName: string): Promise<Record<string, unknown>[]> {
    const response = await fetch(`${this.baseUrl}/objects/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        collectionName,
        filter: {},
        options: {
          limit: 200
        }
      })
    });

    const body = await this.readResponse<SearchObjectsResponse>(response);
    return body.documents ?? [];
  }

  async updateObject(
    collectionName: string,
    filter: Record<string, unknown>,
    update: Record<string, unknown>
  ): Promise<number> {
    const response = await fetch(`${this.baseUrl}/object/update`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        collectionName,
        filter,
        update
      })
    });

    const body = await this.readResponse<UpdateObjectResponse>(response);
    return body.modifiedCount ?? 0;
  }

  async createObject(collectionName: string, document: Record<string, unknown>): Promise<string> {
    const response = await fetch(`${this.baseUrl}/object/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        collectionName,
        document
      })
    });

    const body = await this.readResponse<CreateObjectResponse>(response);
    return body.insertedId ?? '';
  }

  async previe(schemaNames: string[]): Promise<IBddPrevieResponse> {
    const params = new URLSearchParams();
    params.set('schemaNames', schemaNames.join(','));

    const response = await fetch(`${this.baseUrl}/previe?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store'
    });

    return this.readResponse<IBddPrevieResponse>(response);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private async readResponse<T>(response: Response): Promise<T> {
    const json = (await response.json()) as ApiResponse<T> | { error?: unknown };
    if (!response.ok) {
      throw new Error(`Bdd API request failed with status ${response.status}`);
    }

    return (json as ApiResponse<T>).data;
  }
}
