import { AuthenticationDomainAdapter } from "./domain-adapter";
import { AuthenticationRouter } from "./router";
import { AuthenticationService } from "./service";
import type { BddRouteService } from "../bdd/service";

export class AuthenticationComponent {
  public readonly router: AuthenticationRouter;

  constructor(bddService?: BddRouteService) {
    const adapter = new AuthenticationDomainAdapter();
    const service = new AuthenticationService(adapter, bddService);
    this.router = new AuthenticationRouter(service, adapter);
  }
}
