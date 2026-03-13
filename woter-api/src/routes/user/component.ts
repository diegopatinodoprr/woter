import { UserDomainAdapter } from "./domain-adapter";
import { UserRouter } from "./router";
import { UserRouteService } from "./service";
import type { BddRouteService } from "../bdd/service";

export class UserComponent {
  public readonly router: UserRouter;

  constructor(bddService?: BddRouteService) {
    const adapter = new UserDomainAdapter();
    const service = new UserRouteService(adapter, bddService);
    this.router = new UserRouter(service, adapter);
  }
}
