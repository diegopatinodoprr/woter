import { BddDomainAdapter } from "./domain-adapter";
import { BddRouter } from "./router";
import { BddRouteService } from "./service";

export class BddComponent {
  public readonly router: BddRouter;

  constructor(service = new BddRouteService()) {
    const adapter = new BddDomainAdapter();
    this.router = new BddRouter(service, adapter);
  }
}
