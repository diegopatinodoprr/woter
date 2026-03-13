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
  private readonly authCollectionName = "auth_users";

  toLoginRequest(body: unknown): services.IAuthLoginRequest {
    return body as services.IAuthLoginRequest;
  }

  toRegisterRequest(body: unknown): services.IAuthRegisterRequest {
    return body as services.IAuthRegisterRequest;
  }

  toRefreshRequest(body: unknown): services.IAuthRefreshRequest {
    return body as services.IAuthRefreshRequest;
  }

  toLoginResponse(
    user: { id: string; email: string; role: "user" | "admin" },
    tokens: services.IAuthTokens
  ): services.IAuthLoginResponse {
    return { user, tokens };
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

  toSearchAuthUserByEmailRequest(email: string): services.IBddSearchObjectRequest {
    return {
      collectionName: this.authCollectionName,
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
      collectionName: this.authCollectionName,
      document: document as unknown as interfaces.IMongoDocument,
    };
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
}
