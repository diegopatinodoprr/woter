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
  }

  protected configure() {
    this.router.post(
      "/login",
      this.jsonParser(),
      async (req: Request, res: Response) => {
        const payload = this.adapter.toLoginRequest(req.body);
        const error = validateLogin(payload);
        if (error) return this.badRequest(res, error);

        try {
          const user = await this.service.login(payload.email, payload.password);
          const tokens = this.service.issueTokens(user);
          const response = this.adapter.toLoginResponse(user, tokens);
          return this.ok(res, response);
        } catch (err) {
          if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
            return this.unauthorized(res, "Invalid credentials");
          }
          return this.fail(res, 500);
        }
      }
    );

    this.router.post(
      "/register",
      this.jsonParser(),
      async (req: Request, res: Response) => {
        const payload = this.adapter.toRegisterRequest(req.body);
        const error = validateRegister(payload);
        if (error) return this.badRequest(res, error);

        const user = await this.service.register(payload.email, payload.password, payload.name);
        const tokens = this.service.issueTokens(user);
        const response = this.adapter.toRegisterResponse(user, tokens);
        return this.created(res, response);
      }
    );

    this.router.post(
      "/refresh",
      this.jsonParser(),
      async (req: Request, res: Response) => {
        const payload = this.adapter.toRefreshRequest(req.body);
        const error = validateRefresh(payload);
        if (error) return this.badRequest(res, error);

        const user = await this.service.refresh(payload.refreshToken);
        const tokens = this.service.issueTokens(user);
        const response = this.adapter.toRefreshResponse(tokens);
        return this.ok(res, response);
      }
    );
  }
}
