export interface IHttpRequestOptions {
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean | undefined>;
}
export interface IHttpClient {
    get<T>(url: string, options?: IHttpRequestOptions): Promise<T>;
    post<T>(url: string, body?: unknown, options?: IHttpRequestOptions): Promise<T>;
    put<T>(url: string, body?: unknown, options?: IHttpRequestOptions): Promise<T>;
    patch<T>(url: string, body?: unknown, options?: IHttpRequestOptions): Promise<T>;
    del<T>(url: string, options?: IHttpRequestOptions): Promise<T>;
}
//# sourceMappingURL=http.d.ts.map