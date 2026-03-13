import express, { type Request, type Response, type Router } from "express";
type ErrorCode = string;
export declare abstract class RouterBase {
    protected readonly router: Router;
    constructor();
    protected configure(): void;
    protected jsonParser(): import("connect").NextHandleFunction;
    protected urlencodedParser(): import("connect").NextHandleFunction;
    protected ok<T>(res: Response, data: T): express.Response<any, Record<string, any>>;
    protected created<T>(res: Response, data: T): express.Response<any, Record<string, any>>;
    protected noContent(res: Response): express.Response<any, Record<string, any>>;
    protected badRequest(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected unauthorized(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected forbidden(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected notFound(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected conflict(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected unprocessable(res: Response, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected fail(res: Response, status: number, message?: string, code?: ErrorCode): express.Response<any, Record<string, any>>;
    protected returnResp<T>(request: Promise<T>, _req: Request, res: Response): Promise<any>;
    getRouter(): express.Router;
    protected getParam(req: Request, key: string): string;
    protected getQuery(req: Request, key: string): string | import("qs").ParsedQs | (string | import("qs").ParsedQs)[] | undefined;
    protected getBody<T>(req: Request): T;
}
export {};
//# sourceMappingURL=router-base.d.ts.map