import type { MongoObjectId } from './types.js';
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
//# sourceMappingURL=user-client.d.ts.map