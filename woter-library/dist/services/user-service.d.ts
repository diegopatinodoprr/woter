import type { IUser } from '../interfaces/user';
export interface IUpdateUserInfoRequest {
    userId: string;
    email?: string;
    name?: string;
}
export interface IUpdateUserInfoResponse {
    user: IUser;
}
export interface IAddUserFavoriteCitiesRequest {
    userId: string;
    cities: string[];
}
export interface IAddUserFavoriteCitiesResponse {
    user: IUser;
}
export interface IUserServiceContract {
    updateInfo(payload: IUpdateUserInfoRequest): Promise<IUpdateUserInfoResponse>;
    addFavoriteCities(payload: IAddUserFavoriteCitiesRequest): Promise<IAddUserFavoriteCitiesResponse>;
}
//# sourceMappingURL=user-service.d.ts.map