"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterBase = void 0;
const express_1 = __importDefault(require("express"));
class RouterBase {
    router;
    constructor() {
        this.router = express_1.default.Router();
        this.configure();
    }
    // Override in subclasses to register routes
    configure() { }
    // Body parsers
    jsonParser() {
        return express_1.default.json();
    }
    urlencodedParser() {
        return express_1.default.urlencoded({ extended: true });
    }
    // Response helpers
    ok(res, data) {
        return res.status(200).json({ data });
    }
    created(res, data) {
        return res.status(201).json({ data });
    }
    noContent(res) {
        return res.status(204).end();
    }
    badRequest(res, message = "Bad Request", code = "BAD_REQUEST") {
        return res.status(400).json({ error: { code, message } });
    }
    unauthorized(res, message = "Unauthorized", code = "UNAUTHORIZED") {
        return res.status(401).json({ error: { code, message } });
    }
    forbidden(res, message = "Forbidden", code = "FORBIDDEN") {
        return res.status(403).json({ error: { code, message } });
    }
    notFound(res, message = "Not Found", code = "NOT_FOUND") {
        return res.status(404).json({ error: { code, message } });
    }
    conflict(res, message = "Conflict", code = "CONFLICT") {
        return res.status(409).json({ error: { code, message } });
    }
    unprocessable(res, message = "Unprocessable Entity", code = "UNPROCESSABLE") {
        return res.status(422).json({ error: { code, message } });
    }
    fail(res, status, message = "Internal Server Error", code = "INTERNAL") {
        return res.status(status).json({ error: { code, message } });
    }
    returnResp(request, _req, res) {
        return request
            .then((data) => this.ok(res, data))
            .catch(() => this.fail(res, 500));
    }
    // Public accessor
    getRouter() {
        return this.router;
    }
    // Optional request helpers
    getParam(req, key) {
        return req.params[key];
    }
    getQuery(req, key) {
        return req.query[key];
    }
    getBody(req) {
        return req.body;
    }
}
exports.RouterBase = RouterBase;
//# sourceMappingURL=router-base.js.map