import type { interfaces, services } from "@diegopatinodoprr/woter-library";

export class UserDomainAdapter {
  private readonly userCollectionName = "users";

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

  toSearchUserRequest(userId: string): services.IBddSearchObjectRequest {
    return {
      collectionName: this.userCollectionName,
      filter: { id: userId },
    };
  }

  toCreateUserRequest(user: interfaces.IUser): services.IBddCreateObjectRequest {
    return {
      collectionName: this.userCollectionName,
      document: user as unknown as interfaces.IMongoDocument,
    };
  }

  toUpdateUserRequest(
    userId: string,
    update: unknown
  ): services.IBddUpdateObjectRequest {
    return {
      collectionName: this.userCollectionName,
      filter: { id: userId },
      update: update as interfaces.IMongoDocument,
    };
  }

  toUserFromSearchResponse(
    response: services.IBddSearchObjectResponse
  ): interfaces.IUser | null {
    if (!response.document) {
      return null;
    }

    return response.document as unknown as interfaces.IUser;
  }
}
