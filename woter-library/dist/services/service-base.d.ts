import type { ApiClient } from "./api-client.js";
export declare class ServiceBase {
    protected readonly api: ApiClient;
    constructor(api: ApiClient);
    protected get<T>(path: string): Promise<T>;
    protected post<T>(path: string, body?: unknown): Promise<T>;
    protected put<T>(path: string, body?: unknown): Promise<T>;
    protected patch<T>(path: string, body?: unknown): Promise<T>;
    protected del<T>(path: string): Promise<T>;
}
//# sourceMappingURL=service-base.d.ts.map