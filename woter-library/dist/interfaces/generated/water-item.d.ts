import type { MongoObjectId } from './types.js';
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
//# sourceMappingURL=water-item.d.ts.map