import type {
  IAddUserFavoriteCitiesRequest,
  IAddUserFavoriteCitiesResponse,
  IUpdateUserInfoRequest,
  IUpdateUserInfoResponse,
  IUser,
} from 'woter-library';

export class UserDomainAdapter {
  toUpdateInfoRequest(body: unknown): IUpdateUserInfoRequest {
    return body as IUpdateUserInfoRequest;
  }

  toAddFavoriteCitiesRequest(body: unknown): IAddUserFavoriteCitiesRequest {
    return body as IAddUserFavoriteCitiesRequest;
  }

  toUpdateInfoResponse(user: IUser): IUpdateUserInfoResponse {
    return { user };
  }

  toAddFavoriteCitiesResponse(user: IUser): IAddUserFavoriteCitiesResponse {
    return { user };
  }
}
