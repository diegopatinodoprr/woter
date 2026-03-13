import type { Request, Response } from "express";
import { server } from "@diegopatinodoprr/woter-library";
import type { AuthenticationService } from "./service";
import type { AuthenticationDomainAdapter } from "./domain-adapter";
import { validateLogin, validateRefresh, validateRegister } from "./validator";

export class AuthenticationRouter extends server.RouterBase {
  constructor(
    private readonly service: AuthenticationService,
    private readonly adapter: AuthenticationDomainAdapter
  ) {
    super();

    this.router.get("/isAlive/", this.isAlive);
    this.router.post("/login", this.jsonParser(), this.login);
    this.router.post("/register", this.jsonParser(), this.register);
    this.router.post("/refresh", this.jsonParser(), this.refresh);
  }

  public isAlive = (req: any, res: any): Promise<any> => {
    return this.returnResp(Promise.resolve(true), req, res);
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    const payload = this.adapter.toLoginRequest(req.body);
    const error = validateLogin(payload);
    if (error) return this.badRequest(res, error);

    try {
      const type = this.adapter.toLoginType(payload);
      const user = await this.service.login(payload.email, payload.password, type);
      const tokens = this.service.issueTokens(user);
      const response = this.adapter.toLoginResponse(tokens);
      return this.ok(res, response);
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        return this.unauthorized(res, "Invalid credentials");
      }
      return this.fail(res, 500);
    }
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    const payload = this.adapter.toRegisterRequest(req.body);
    const error = validateRegister(payload);
    if (error) return this.badRequest(res, error);

    try {
      const user = await this.service.register(payload.email, payload.password, payload.name);
      const tokens = this.service.issueTokens(user);
      const response = this.adapter.toRegisterResponse(user, tokens);
      return this.created(res, response);
    } catch (err) {
      if (err instanceof Error && err.message === "USER_ALREADY_EXISTS") {
        return this.conflict(res, "User already exists");
      }
      return this.fail(res, 500);
    }
  };

  public refresh = async (req: Request, res: Response): Promise<Response> => {
    const payload = this.adapter.toRefreshRequest(req.body);
    const error = validateRefresh(payload);
    if (error) return this.badRequest(res, error);

    const user = await this.service.refresh(payload.refreshToken);
    const tokens = this.service.issueTokens(user);
    const response = this.adapter.toRefreshResponse(tokens);
    return this.ok(res, response);
  };
}
