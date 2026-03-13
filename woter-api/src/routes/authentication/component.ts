import { AuthenticationDomainAdapter } from "./domain-adapter";
import { AuthenticationRouter } from "./router";
import { AuthenticationService } from "./service";

export class AuthenticationComponent {
  public readonly router: AuthenticationRouter;

  constructor() {
    const adapter = new AuthenticationDomainAdapter();
    const service = new AuthenticationService(adapter);
    this.router = new AuthenticationRouter(service, adapter);
  }
}
