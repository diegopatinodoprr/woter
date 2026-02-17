import { AuthenticationDomainAdapter } from "./domain-adapter";
import { AuthenticationRouter } from "./router";
import { AuthenticationService } from "./service";

export class AuthenticationComponent {
  public readonly router: AuthenticationRouter;

  constructor() {
    const service = new AuthenticationService();
    const adapter = new AuthenticationDomainAdapter();
    this.router = new AuthenticationRouter(service, adapter);
  }
}
