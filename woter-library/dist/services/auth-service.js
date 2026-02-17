import { ServiceBase } from "./service-base";
export class AuthService extends ServiceBase {
    login(payload) {
        return this.post("/auth/login", payload);
    }
    register(payload) {
        return this.post("/auth/register", payload);
    }
    refresh(payload) {
        return this.post("/auth/refresh", payload);
    }
}
//# sourceMappingURL=auth-service.js.map