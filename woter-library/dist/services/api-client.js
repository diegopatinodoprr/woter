"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
class ApiClient {
    baseUrl;
    http;
    constructor(baseUrl, http) {
        this.baseUrl = baseUrl;
        this.http = http;
    }
    get(path) {
        return this.http.get(this.baseUrl + path);
    }
    post(path, body) {
        return this.http.post(this.baseUrl + path, body);
    }
    put(path, body) {
        return this.http.put(this.baseUrl + path, body);
    }
    patch(path, body) {
        return this.http.patch(this.baseUrl + path, body);
    }
    del(path) {
        return this.http.del(this.baseUrl + path);
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=api-client.js.map