import type { Request, Response } from "express";
import { server } from "@diegopatinodoprr/woter-library";
import type { BddDomainAdapter } from "./domain-adapter";
import type { BddRouteService } from "./service";
import {
  validateCreateObject,
  validateCreateObjects,
  validateDeleteObject,
  validateDeleteObjects,
  validateSearchObject,
  validateSearchObjects,
  validateUpdateObject,
  validateUpdateObjects,
} from "./validator";

export class BddRouter extends server.RouterBase {
  constructor(
    private readonly service: BddRouteService,
    private readonly adapter: BddDomainAdapter
  ) {
    super();
  }

  protected configure(): void {
    this.router.post("/connect", this.jsonParser(), async (req: Request, res: Response) => {
      try {
        const payload = this.adapter.toConnectRequest(req.body);
        const response = await this.service.connect(payload);
        return this.ok(res, this.adapter.toConnectResponse(response));
      } catch (error) {
        if (error instanceof Error && error.message.includes("MONGO_BDD_URL")) {
          return this.badRequest(res, error.message);
        }
        return this.fail(res, 500);
      }
    });

    this.router.post("/object/create", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toCreateObjectRequest(req.body);
      const validationError = validateCreateObject(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.createObject(payload);
        return this.created(res, this.adapter.toCreateObjectResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/objects/create", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toCreateObjectsRequest(req.body);
      const validationError = validateCreateObjects(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.createObjects(payload);
        return this.created(res, this.adapter.toCreateObjectsResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/object/search", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toSearchObjectRequest(req.body);
      const validationError = validateSearchObject(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.searchObject(payload);
        return this.ok(res, this.adapter.toSearchObjectResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/objects/search", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toSearchObjectsRequest(req.body);
      const validationError = validateSearchObjects(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.searchObjects(payload);
        return this.ok(res, this.adapter.toSearchObjectsResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/object/update", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toUpdateObjectRequest(req.body);
      const validationError = validateUpdateObject(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.updateObject(payload);
        return this.ok(res, this.adapter.toUpdateObjectResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/objects/update", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toUpdateObjectsRequest(req.body);
      const validationError = validateUpdateObjects(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.updateObjects(payload);
        return this.ok(res, this.adapter.toUpdateObjectsResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/object/delete", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toDeleteObjectRequest(req.body);
      const validationError = validateDeleteObject(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.deleteObject(payload);
        return this.ok(res, this.adapter.toDeleteObjectResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });

    this.router.post("/objects/delete", this.jsonParser(), async (req: Request, res: Response) => {
      const payload = this.adapter.toDeleteObjectsRequest(req.body);
      const validationError = validateDeleteObjects(payload);
      if (validationError) {
        return this.badRequest(res, validationError);
      }

      try {
        const response = await this.service.deleteObjects(payload);
        return this.ok(res, this.adapter.toDeleteObjectsResponse(response));
      } catch {
        return this.fail(res, 500);
      }
    });
  }
}
