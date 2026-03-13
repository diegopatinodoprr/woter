import type { NextFunction, Request, Response } from "express";
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

    this.router.get("/isAlive/", this.isAlive);
    this.router.post("/object/create", this.jsonParser(), this.createObject);
    this.router.post("/objects/create", this.jsonParser(), this.createObjects);
    this.router.post("/object/search", this.jsonParser(), this.searchObject);
    this.router.post("/objects/search", this.jsonParser(), this.searchObjects);
    this.router.post("/object/update", this.jsonParser(), this.updateObject);
    this.router.post("/objects/update", this.jsonParser(), this.updateObjects);
    this.router.post("/object/delete", this.jsonParser(), this.deleteObject);
    this.router.post("/objects/delete", this.jsonParser(), this.deleteObjects);

  }

  protected parseBody(req: Request, res: Response, next: NextFunction): void {
    this.jsonParser()(req, res, next);
  }

  public isAlive = (req: any, res: any): Promise<any> => {
    return this.returnResp(Promise.resolve(true), req, res);
  }

  public createObject = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public createObjects = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public searchObject = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public searchObjects = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public updateObject = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public updateObjects = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public deleteObject = async (req: Request, res: Response): Promise<Response> => {
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
  }

  public deleteObjects = async (req: Request, res: Response): Promise<Response> => {
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
  }

  // Temporary shim until woter-api consumes @diegopatinodoprr/woter-library >= 0.1.6
  protected returnResp<T>(request: Promise<T>, _req: Request, res: Response): Promise<any> {
    return request
      .then((data) => this.ok(res, data))
      .catch(() => this.fail(res, 500));
  }
}
