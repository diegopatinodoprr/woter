import { UserDomainAdapter } from "./domain-adapter";
import { UserRouter } from "./router";
import { UserRouteService } from "./service";

export class UserComponent {
  public readonly router: UserRouter;

  constructor() {
    const service = new UserRouteService();
    const adapter = new UserDomainAdapter();
    this.router = new UserRouter(service, adapter);
  }
}
