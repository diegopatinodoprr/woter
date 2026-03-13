import type { NextFunction, Request, Response } from "express";
import { server } from "@diegopatinodoprr/woter-library";
import type { UserDomainAdapter } from "./domain-adapter";
import type { UserRouteService } from "./service";
import { validateAddFavoriteCities, validateUpdateInfo } from "./validator";

export class UserRouter extends server.RouterBase {
  constructor(
    private readonly service: UserRouteService,
    private readonly adapter: UserDomainAdapter
  ) {
    super();

    this.router.get("/isAlive/", this.isAlive);
    this.router.patch("/info", this.jsonParser(), this.info);
    this.router.post("/favorite-cities", this.jsonParser(), this.favoriteCities);

  }

  protected parseBody(req: Request, res: Response, next: NextFunction): void {
    this.jsonParser()(req, res, next);
  }

  public isAlive = (req: any, res: any): Promise<any> => {
    return this.returnResp(Promise.resolve(true), req, res);
  }

  public info = async (req: Request, res: Response): Promise<Response> => {
    const payload = this.adapter.toUpdateInfoRequest(req.body);
    const error = validateUpdateInfo(payload);
    if (error) {
      return this.badRequest(res, error);
    }

    const user = await this.service.updateInfo(payload);
    const response = this.adapter.toUpdateInfoResponse(user);
    return this.ok(res, response);
  }

  public favoriteCities = async (req: Request, res: Response): Promise<Response> => {
    const payload = this.adapter.toAddFavoriteCitiesRequest(req.body);
    const error = validateAddFavoriteCities(payload);
    if (error) {
      return this.badRequest(res, error);
    }

    const user = await this.service.addFavoriteCities(payload);
    const response = this.adapter.toAddFavoriteCitiesResponse(user);
    return this.ok(res, response);
  }

  // Temporary shim until woter-api consumes @diegopatinodoprr/woter-library >= 0.1.6
  protected returnResp<T>(request: Promise<T>, _req: Request, res: Response): Promise<any> {
    return request
      .then((data) => this.ok(res, data))
      .catch(() => this.fail(res, 500));
  }
}
