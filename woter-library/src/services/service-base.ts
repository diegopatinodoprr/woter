import type { ApiClient } from "./api-client";

export class ServiceBase {
  constructor(protected readonly api: ApiClient) {}

  protected get<T>(path: string) {
    return this.api.get<T>(path);
  }

  protected post<T>(path: string, body?: unknown) {
    return this.api.post<T>(path, body);
  }

  protected put<T>(path: string, body?: unknown) {
    return this.api.put<T>(path, body);
  }

  protected patch<T>(path: string, body?: unknown) {
    return this.api.patch<T>(path, body);
  }

  protected del<T>(path: string) {
    return this.api.del<T>(path);
  }
}
