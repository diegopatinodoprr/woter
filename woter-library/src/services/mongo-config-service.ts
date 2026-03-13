import type {
  IMongoConnectionConfig,
  IMongoEnvironment,
} from '../interfaces/mongo';

export class MongoConfigService {
  constructor(private readonly environment: IMongoEnvironment = MongoConfigService.readProcessEnvironment()) {}

  public getConnectionConfig(overrides: Partial<IMongoConnectionConfig> = {}): IMongoConnectionConfig {
    const mongoBddUrl = overrides.mongoBddUrl ?? this.environment.MONGO_BDD_URL;

    if (!mongoBddUrl) {
      throw new Error('Missing environment variable: MONGO_BDD_URL');
    }

    return {
      mongoBddUrl,
      databaseName: overrides.databaseName ?? this.environment.MONGO_DB_NAME,
    };
  }

  private static readProcessEnvironment(): IMongoEnvironment {
    if (typeof process === 'undefined' || !process?.env) {
      return {};
    }

    return {
      MONGO_BDD_URL: process.env.MONGO_BDD_URL,
      MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    };
  }
}
