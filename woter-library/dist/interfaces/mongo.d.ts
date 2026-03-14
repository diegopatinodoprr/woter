export type IMongoDocument = Record<string, unknown>;
export interface IMongoEnvironment {
    MONGO_BDD_URL?: string;
    MONGO_DB_NAME?: string;
}
export interface IMongoConnectionConfig {
    mongoBddUrl: string;
    databaseName?: string;
}
export interface IMongoFindOptions {
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
    projection?: Record<string, 0 | 1>;
}
export interface IMongoDatabaseServiceContract {
    connect(config?: Partial<IMongoConnectionConfig>): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    createObject<TDocument extends IMongoDocument>(collectionName: string, document: TDocument): Promise<string>;
    createObjects<TDocument extends IMongoDocument>(collectionName: string, documents: TDocument[]): Promise<string[]>;
    searchObject<TDocument extends IMongoDocument>(collectionName: string, filter: IMongoDocument): Promise<TDocument | null>;
    searchObjects<TDocument extends IMongoDocument>(collectionName: string, filter: IMongoDocument, options?: IMongoFindOptions): Promise<TDocument[]>;
    updateObject(collectionName: string, filter: IMongoDocument, update: IMongoDocument): Promise<number>;
    updateObjects(collectionName: string, filter: IMongoDocument, update: IMongoDocument): Promise<number>;
    deleteObject(collectionName: string, filter: IMongoDocument): Promise<number>;
    deleteObjects(collectionName: string, filter: IMongoDocument): Promise<number>;
    findOne<TDocument extends IMongoDocument>(collectionName: string, filter: IMongoDocument): Promise<TDocument | null>;
    findMany<TDocument extends IMongoDocument>(collectionName: string, filter: IMongoDocument, options?: IMongoFindOptions): Promise<TDocument[]>;
    insertOne<TDocument extends IMongoDocument>(collectionName: string, document: TDocument): Promise<string>;
    updateOne(collectionName: string, filter: IMongoDocument, update: IMongoDocument): Promise<number>;
    deleteOne(collectionName: string, filter: IMongoDocument): Promise<number>;
    countObjects(collectionName: string, filter?: IMongoDocument): Promise<number>;
}
//# sourceMappingURL=mongo.d.ts.map