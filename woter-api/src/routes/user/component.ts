import { UserDomainAdapter } from "./domain-adapter";
import { UserRouter } from "./router";
import { UserRouteService } from "./service";

export class UserComponent {
  public readonly router: UserRouter;

  constructor() {
    const adapter = new UserDomainAdapter();
    const service = new UserRouteService(adapter);
    this.router = new UserRouter(service, adapter);
  }
}
