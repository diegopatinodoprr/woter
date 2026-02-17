import type { HttpClient } from "../interfaces/http";

export class ApiClient {
  constructor(private readonly baseUrl: string, private readonly http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(this.baseUrl + path);
  }

  post<T>(path: string, body?: unknown) {
    return this.http.post<T>(this.baseUrl + path, body);
  }

  put<T>(path: string, body?: unknown) {
    return this.http.put<T>(this.baseUrl + path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.http.patch<T>(this.baseUrl + path, body);
  }

  del<T>(path: string) {
    return this.http.del<T>(this.baseUrl + path);
  }
}
