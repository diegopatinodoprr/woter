import type { interfaces, services } from "@diegopatinodoprr/woter-library";

interface AuthUserData {
  id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
}

interface AuthUserDocument extends interfaces.IMongoDocument {
  id: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthenticationDomainAdapter {
  private readonly registerCollectionName = "userclients";

  toLoginRequest(body: unknown): services.IAuthLoginRequest {
    return body as services.IAuthLoginRequest;
  }

  toRegisterRequest(body: unknown): services.IAuthRegisterRequest {
    return body as services.IAuthRegisterRequest;
  }

  toRefreshRequest(body: unknown): services.IAuthRefreshRequest {
    return body as services.IAuthRefreshRequest;
  }

  toLoginResponse(tokens: services.IAuthTokens): services.IAuthLoginResponse {
    return tokens as unknown as services.IAuthLoginResponse;
  }

  toRegisterResponse(
    user: { id: string; email: string; role: "user" | "admin"; name?: string },
    tokens: services.IAuthTokens
  ): services.IAuthRegisterResponse {
    return { user, tokens };
  }

  toRefreshResponse(tokens: services.IAuthTokens): services.IAuthRefreshResponse {
    return { tokens };
  }

  toSearchAuthUserByEmailRequest(
    email: string,
    type: "client" | "admin"
  ): services.IBddSearchObjectRequest {
    return {
      collectionName: this.getLoginCollectionName(type),
      filter: { email },
    };
  }

  toCreateAuthUserRequest(
    user: AuthUserData,
    passwordHash: string
  ): services.IBddCreateObjectRequest {
    const now = new Date().toISOString();
    const document: AuthUserDocument = {
      ...user,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    return {
      collectionName: this.registerCollectionName,
      document: document as unknown as interfaces.IMongoDocument,
    };
  }

  toSearchRegisterUserByEmailRequest(email: string): services.IBddSearchObjectRequest {
    return {
      collectionName: this.registerCollectionName,
      filter: { email },
    };
  }

  toCreateRegisterUserRequest(
    user: AuthUserData,
    passwordHash: string
  ): services.IBddCreateObjectRequest {
    const now = new Date().toISOString();
    const document: AuthUserDocument = {
      ...user,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    return {
      collectionName: this.registerCollectionName,
      document: document as unknown as interfaces.IMongoDocument,
    };
  }

  toUpdateLastConnectionDateRequest(
    email: string,
    type: "client" | "admin",
    lastConnectionDate: string
  ): services.IBddUpdateObjectRequest {
    return {
      collectionName: this.getLoginCollectionName(type),
      filter: { email },
      update: { lastConnectionDate },
    };
  }

  toLoginType(body: services.IAuthLoginRequest): "client" | "admin" {
    const payload = body as services.IAuthLoginRequest & { type?: "client" | "admin" };
    return payload.type === "admin" ? "admin" : "client";
  }

  toAuthUserFromSearchResponse(
    response: services.IBddSearchObjectResponse
  ): AuthUserDocument | null {
    if (!response.document) {
      return null;
    }

    return response.document as unknown as AuthUserDocument;
  }

  toAuthPublicUser(document: AuthUserDocument): { id: string; email: string; role: "user" | "admin"; name?: string } {
    return {
      id: document.id,
      email: document.email,
      role: document.role,
      name: document.name,
    };
  }

  private getLoginCollectionName(type: "client" | "admin"): string {
    return type === "admin" ? "useradmins" : "userclients";
  }
}
