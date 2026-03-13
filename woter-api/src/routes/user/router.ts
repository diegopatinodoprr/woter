import type { Request, Response } from "express";
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
  }

  protected configure() {
    this.router.patch(
      "/info",
      this.jsonParser(),
      (req: Request, res: Response) => {
        const payload = this.adapter.toUpdateInfoRequest(req.body);
        const error = validateUpdateInfo(payload);
        if (error) {
          return this.badRequest(res, error);
        }

        const user = this.service.updateInfo(payload);
        const response = this.adapter.toUpdateInfoResponse(user);
        return this.ok(res, response);
      }
    );

    this.router.post(
      "/favorite-cities",
      this.jsonParser(),
      (req: Request, res: Response) => {
        const payload = this.adapter.toAddFavoriteCitiesRequest(req.body);
        const error = validateAddFavoriteCities(payload);
        if (error) {
          return this.badRequest(res, error);
        }

        const user = this.service.addFavoriteCities(payload);
        const response = this.adapter.toAddFavoriteCitiesResponse(user);
        return this.ok(res, response);
      }
    );
  }
}
