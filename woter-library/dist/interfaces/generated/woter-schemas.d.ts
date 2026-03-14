export type MongoObjectId = string;
export interface IUserClient {
    _id: MongoObjectId;
    email: string;
    role: "client" | "admin";
    name?: string;
    preferredWaterPoints?: MongoObjectId[];
    createdAt: Date;
    updatedAt: Date;
    lastConnectionDate?: Date;
}
export interface IUserAdmin {
    _id: MongoObjectId;
    email: string;
    role: "admin";
    name: string;
    createdAt: Date;
    updatedAt: Date;
    lastConnectionDate?: Date;
}
export interface IWaterItem {
    _id: MongoObjectId;
    address: string;
    gps: {
        lat: number;
        lng: number;
    };
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=woter-schemas.d.ts.map