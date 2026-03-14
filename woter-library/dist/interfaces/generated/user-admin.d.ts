import type { MongoObjectId } from './types.js';
export interface IUserAdmin {
    _id: MongoObjectId;
    email: string;
    role: "admin";
    name: string;
    createdAt: Date;
    updatedAt: Date;
    lastConnectionDate?: Date;
}
//# sourceMappingURL=user-admin.d.ts.map