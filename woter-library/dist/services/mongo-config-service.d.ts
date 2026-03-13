import type { IMongoConnectionConfig, IMongoEnvironment } from '../interfaces/mongo';
export declare class MongoConfigService {
    private readonly environment;
    constructor(environment?: IMongoEnvironment);
    getConnectionConfig(overrides?: Partial<IMongoConnectionConfig>): IMongoConnectionConfig;
    private static readProcessEnvironment;
}
//# sourceMappingURL=mongo-config-service.d.ts.map