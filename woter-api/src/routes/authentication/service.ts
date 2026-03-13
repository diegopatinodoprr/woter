import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { BddRouteService } from "../bdd/service";
import type { AuthenticationDomainAdapter } from "./domain-adapter";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60; // 1h
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30d

export class AuthenticationService {
  constructor(
    private readonly adapter: AuthenticationDomainAdapter,
    private readonly bddService = new BddRouteService()
  ) {}

  async login(email: string, password: string, type: "client" | "admin") {
    const response = await this.bddService.searchObject(this.adapter.toSearchAuthUserByEmailRequest(email, type));
    const authUser = this.adapter.toAuthUserFromSearchResponse(response);

    if (!authUser) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const ok = await this.verifyPassword(password, authUser.passwordHash);
    if (!ok) {
      throw new Error("INVALID_CREDENTIALS");
    }

    await this.bddService.updateObject(
      this.adapter.toUpdateLastConnectionDateRequest(email, type, new Date().toISOString())
    );

    return this.adapter.toAuthPublicUser(authUser);
  }

  async register(email: string, password: string, name?: string) {
    const existingResponse = await this.bddService.searchObject(
      this.adapter.toSearchRegisterUserByEmailRequest(email)
    );
    const existingUser = this.adapter.toAuthUserFromSearchResponse(existingResponse);
    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const passwordHash = await this.hashPassword(password);
    const user = {
      id: randomUUID(),
      email,
      name,
      role: "user" as const,
    };

    await this.bddService.createObject(this.adapter.toCreateRegisterUserRequest(user, passwordHash));

    return user;
  }

  async refresh(_refreshToken: string) {
    // TODO: verify refresh token + rotate
    return { id: "user_1", email: "user@example.com", role: "user" as const };
  }

  issueTokens(user: { id: string; email: string; role: "user" | "admin" }) {
    const secret = process.env.JWT_SECRET ?? "dev-secret";
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
    );
    const refreshToken = jwt.sign(
      { sub: user.id, type: "refresh" },
      secret,
      { expiresIn: REFRESH_TOKEN_TTL_SECONDS }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };
  }

  private hashPassword(password: string) {
    const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
    return bcrypt.hash(password, rounds);
  }

  private verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
