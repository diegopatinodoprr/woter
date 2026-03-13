import type { IMongoDocument, IMongoFindOptions } from '../interfaces/mongo';
export interface IBddConnectRequest {
    databaseName?: string;
}
export interface IBddConnectResponse {
    connected: boolean;
    databaseName?: string;
}
export interface IBddCreateObjectRequest {
    collectionName: string;
    document: IMongoDocument;
}
export interface IBddCreateObjectResponse {
    insertedId: string;
}
export interface IBddCreateObjectsRequest {
    collectionName: string;
    documents: IMongoDocument[];
}
export interface IBddCreateObjectsResponse {
    insertedIds: string[];
}
export interface IBddSearchObjectRequest {
    collectionName: string;
    filter: IMongoDocument;
}
export interface IBddSearchObjectResponse {
    document: IMongoDocument | null;
}
export interface IBddSearchObjectsRequest {
    collectionName: string;
    filter: IMongoDocument;
    options?: IMongoFindOptions;
}
export interface IBddSearchObjectsResponse {
    documents: IMongoDocument[];
}
export interface IBddUpdateObjectRequest {
    collectionName: string;
    filter: IMongoDocument;
    update: IMongoDocument;
}
export interface IBddUpdateObjectResponse {
    modifiedCount: number;
}
export interface IBddUpdateObjectsRequest {
    collectionName: string;
    filter: IMongoDocument;
    update: IMongoDocument;
}
export interface IBddUpdateObjectsResponse {
    modifiedCount: number;
}
export interface IBddDeleteObjectRequest {
    collectionName: string;
    filter: IMongoDocument;
}
export interface IBddDeleteObjectResponse {
    deletedCount: number;
}
export interface IBddDeleteObjectsRequest {
    collectionName: string;
    filter: IMongoDocument;
}
export interface IBddDeleteObjectsResponse {
    deletedCount: number;
}
//# sourceMappingURL=bdd-service.d.ts.map