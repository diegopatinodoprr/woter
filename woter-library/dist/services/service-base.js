export class ServiceBase {
    api;
    constructor(api) {
        this.api = api;
    }
    get(path) {
        return this.api.get(path);
    }
    post(path, body) {
        return this.api.post(path, body);
    }
    put(path, body) {
        return this.api.put(path, body);
    }
    patch(path, body) {
        return this.api.patch(path, body);
    }
    del(path) {
        return this.api.del(path);
    }
}
//# sourceMappingURL=service-base.js.map