export interface HttpRequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}

export interface HttpClient {
  get<T>(url: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T>;
  put<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T>;
  patch<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T>;
  del<T>(url: string, options?: HttpRequestOptions): Promise<T>;
}
