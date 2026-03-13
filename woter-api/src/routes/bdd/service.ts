import {
  interfaces,
  services,
} from "@diegopatinodoprr/woter-library";
import { MongoClient } from "mongodb";

export class MongoDatabaseService implements interfaces.IMongoDatabaseServiceContract {
  private readonly configService = new services.MongoConfigService();
  private client: MongoClient | null = null;
  private currentConfig: interfaces.IMongoConnectionConfig | null = null;

  public async connect(config: Partial<interfaces.IMongoConnectionConfig> = {}): Promise<void> {
    const resolvedConfig = this.configService.getConnectionConfig(config);
    const shouldReconnect = this.currentConfig?.mongoBddUrl !== resolvedConfig.mongoBddUrl;

    if (this.client && this.isConnected() && !shouldReconnect) {
      return;
    }

    if (this.client) {
      await this.disconnect();
    }

    this.client = new MongoClient(resolvedConfig.mongoBddUrl);
    await this.client.connect();
    this.currentConfig = resolvedConfig;
  }

  public async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.close();
    this.client = null;
    this.currentConfig = null;
  }

  public isConnected(): boolean {
    return this.client !== null;
  }

  public async createObject<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    document: TDocument
  ): Promise<string> {
    return this.insertOne(collectionName, document);
  }

  public async createObjects<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    documents: TDocument[]
  ): Promise<string[]> {
    const collection = this.getCollection(collectionName);
    const result = await collection.insertMany(documents);
    return Object.values(result.insertedIds).map((insertedId) => insertedId.toString());
  }

  public async searchObject<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    filter: interfaces.IMongoDocument
  ): Promise<TDocument | null> {
    return this.findOne(collectionName, filter);
  }

  public async searchObjects<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    filter: interfaces.IMongoDocument,
    options: interfaces.IMongoFindOptions = {}
  ): Promise<TDocument[]> {
    return this.findMany(collectionName, filter, options);
  }

  public async updateObject(
    collectionName: string,
    filter: interfaces.IMongoDocument,
    update: interfaces.IMongoDocument
  ): Promise<number> {
    return this.updateOne(collectionName, filter, update);
  }

  public async updateObjects(
    collectionName: string,
    filter: interfaces.IMongoDocument,
    update: interfaces.IMongoDocument
  ): Promise<number> {
    const collection = this.getCollection(collectionName);
    const result = await collection.updateMany(filter, { $set: update });
    return result.modifiedCount;
  }

  public async deleteObject(
    collectionName: string,
    filter: interfaces.IMongoDocument
  ): Promise<number> {
    return this.deleteOne(collectionName, filter);
  }

  public async deleteObjects(
    collectionName: string,
    filter: interfaces.IMongoDocument
  ): Promise<number> {
    const collection = this.getCollection(collectionName);
    const result = await collection.deleteMany(filter);
    return result.deletedCount;
  }

  public async findOne<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    filter: interfaces.IMongoDocument
  ): Promise<TDocument | null> {
    const collection = this.getCollection(collectionName);
    const document = await collection.findOne(filter);
    return document as TDocument | null;
  }

  public async findMany<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    filter: interfaces.IMongoDocument,
    options: interfaces.IMongoFindOptions = {}
  ): Promise<TDocument[]> {
    const collection = this.getCollection(collectionName);
    const cursor = collection.find(filter, {
      sort: options.sort,
      projection: options.projection,
      skip: options.skip,
      limit: options.limit,
    });
    const documents = await cursor.toArray();
    return documents as unknown as TDocument[];
  }

  public async insertOne<TDocument extends interfaces.IMongoDocument>(
    collectionName: string,
    document: TDocument
  ): Promise<string> {
    const collection = this.getCollection(collectionName);
    const result = await collection.insertOne(document);
    return result.insertedId.toString();
  }

  public async updateOne(
    collectionName: string,
    filter: interfaces.IMongoDocument,
    update: interfaces.IMongoDocument
  ): Promise<number> {
    const collection = this.getCollection(collectionName);
    const result = await collection.updateOne(filter, { $set: update });
    return result.modifiedCount;
  }

  public async deleteOne(
    collectionName: string,
    filter: interfaces.IMongoDocument
  ): Promise<number> {
    const collection = this.getCollection(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount;
  }

  private getCollection(collectionName: string) {
    if (!this.client || !this.currentConfig) {
      throw new Error("MONGO_NOT_CONNECTED");
    }

    const database = this.client.db(this.currentConfig.databaseName);
    return database.collection(collectionName);
  }
}

export class BddRouteService {
  constructor(private readonly databaseService = new MongoDatabaseService()) {}
  private readonly configService = new services.MongoConfigService();

  public async connect(request: services.IBddConnectRequest): Promise<services.IBddConnectResponse> {
    const config = this.configService.getConnectionConfig({ databaseName: request.databaseName });
    await this.databaseService.connect(config);

    return {
      connected: this.databaseService.isConnected(),
      databaseName: config.databaseName,
    };
  }

  public async createObject(
    request: services.IBddCreateObjectRequest
  ): Promise<services.IBddCreateObjectResponse> {
    const insertedId = await this.databaseService.createObject(request.collectionName, request.document);
    return { insertedId };
  }

  public async createObjects(
    request: services.IBddCreateObjectsRequest
  ): Promise<services.IBddCreateObjectsResponse> {
    const insertedIds = await this.databaseService.createObjects(request.collectionName, request.documents);
    return { insertedIds };
  }

  public async searchObject(
    request: services.IBddSearchObjectRequest
  ): Promise<services.IBddSearchObjectResponse> {
    const document = await this.databaseService.searchObject(request.collectionName, request.filter);
    return { document };
  }

  public async searchObjects(
    request: services.IBddSearchObjectsRequest
  ): Promise<services.IBddSearchObjectsResponse> {
    const documents = await this.databaseService.searchObjects(
      request.collectionName,
      request.filter,
      request.options
    );
    return { documents };
  }

  public async updateObject(
    request: services.IBddUpdateObjectRequest
  ): Promise<services.IBddUpdateObjectResponse> {
    const modifiedCount = await this.databaseService.updateObject(
      request.collectionName,
      request.filter,
      request.update
    );
    return { modifiedCount };
  }

  public async updateObjects(
    request: services.IBddUpdateObjectsRequest
  ): Promise<services.IBddUpdateObjectsResponse> {
    const modifiedCount = await this.databaseService.updateObjects(
      request.collectionName,
      request.filter,
      request.update
    );
    return { modifiedCount };
  }

  public async deleteObject(
    request: services.IBddDeleteObjectRequest
  ): Promise<services.IBddDeleteObjectResponse> {
    const deletedCount = await this.databaseService.deleteObject(request.collectionName, request.filter);
    return { deletedCount };
  }

  public async deleteObjects(
    request: services.IBddDeleteObjectsRequest
  ): Promise<services.IBddDeleteObjectsResponse> {
    const deletedCount = await this.databaseService.deleteObjects(request.collectionName, request.filter);
    return { deletedCount };
  }
}
