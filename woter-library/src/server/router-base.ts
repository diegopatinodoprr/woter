import express, { type Request, type Response, type Router } from "express";

type ErrorCode = string;

export abstract class RouterBase {
  protected readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.configure();
  }

  // Override in subclasses to register routes
  protected configure(): void {}

  // Body parsers
  protected jsonParser() {
    return express.json();
  }

  protected urlencodedParser() {
    return express.urlencoded({ extended: true });
  }

  // Response helpers
  protected ok<T>(res: Response, data: T) {
    return res.status(200).json({ data });
  }

  protected created<T>(res: Response, data: T) {
    return res.status(201).json({ data });
  }

  protected noContent(res: Response) {
    return res.status(204).end();
  }

  protected badRequest(res: Response, message = "Bad Request", code: ErrorCode = "BAD_REQUEST") {
    return res.status(400).json({ error: { code, message } });
  }

  protected unauthorized(res: Response, message = "Unauthorized", code: ErrorCode = "UNAUTHORIZED") {
    return res.status(401).json({ error: { code, message } });
  }

  protected forbidden(res: Response, message = "Forbidden", code: ErrorCode = "FORBIDDEN") {
    return res.status(403).json({ error: { code, message } });
  }

  protected notFound(res: Response, message = "Not Found", code: ErrorCode = "NOT_FOUND") {
    return res.status(404).json({ error: { code, message } });
  }

  protected conflict(res: Response, message = "Conflict", code: ErrorCode = "CONFLICT") {
    return res.status(409).json({ error: { code, message } });
  }

  protected unprocessable(res: Response, message = "Unprocessable Entity", code: ErrorCode = "UNPROCESSABLE") {
    return res.status(422).json({ error: { code, message } });
  }

  protected fail(res: Response, status: number, message = "Internal Server Error", code: ErrorCode = "INTERNAL") {
    return res.status(status).json({ error: { code, message } });
  }

  // Public accessor
  getRouter() {
    return this.router;
  }

  // Optional request helpers
  protected getParam(req: Request, key: string) {
    return req.params[key];
  }

  protected getQuery(req: Request, key: string) {
    return req.query[key];
  }

  protected getBody<T>(req: Request) {
    return req.body as T;
  }
}
