export class MongoConfigService {
    environment;
    constructor(environment = MongoConfigService.readProcessEnvironment()) {
        this.environment = environment;
    }
    getConnectionConfig(overrides = {}) {
        const mongoBddUrl = overrides.mongoBddUrl ?? this.environment.MONGO_BDD_URL;
        if (!mongoBddUrl) {
            throw new Error('Missing environment variable: MONGO_BDD_URL');
        }
        return {
            mongoBddUrl,
            databaseName: overrides.databaseName ?? this.environment.MONGO_DB_NAME,
        };
    }
    static readProcessEnvironment() {
        if (typeof process === 'undefined' || !process?.env) {
            return {};
        }
        return {
            MONGO_BDD_URL: process.env.MONGO_BDD_URL,
            MONGO_DB_NAME: process.env.MONGO_DB_NAME,
        };
    }
}
//# sourceMappingURL=mongo-config-service.js.map