import type { IHttpClient } from '../interfaces/http';
export declare class ApiClient {
    private readonly baseUrl;
    private readonly http;
    constructor(baseUrl: string, http: IHttpClient);
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    patch<T>(path: string, body?: unknown): Promise<T>;
    del<T>(path: string): Promise<T>;
}
//# sourceMappingURL=api-client.d.ts.map