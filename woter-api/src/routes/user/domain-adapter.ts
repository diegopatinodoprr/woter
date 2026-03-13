import type { interfaces, services } from "@diegopatinodoprr/woter-library";

export class UserDomainAdapter {
  toUpdateInfoRequest(body: unknown): services.IUpdateUserInfoRequest {
    return body as services.IUpdateUserInfoRequest;
  }

  toAddFavoriteCitiesRequest(body: unknown): services.IAddUserFavoriteCitiesRequest {
    return body as services.IAddUserFavoriteCitiesRequest;
  }

  toUpdateInfoResponse(user: interfaces.IUser): services.IUpdateUserInfoResponse {
    return { user };
  }

  toAddFavoriteCitiesResponse(user: interfaces.IUser): services.IAddUserFavoriteCitiesResponse {
    return { user };
  }
}
