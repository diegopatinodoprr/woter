import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60; // 1h
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30d

export class AuthenticationService {
  async login(email: string, password: string) {
    // TODO: load user + passwordHash from DB by email
    const storedHash = process.env.DEMO_PASSWORD_HASH;
    if (storedHash) {
      const ok = await this.verifyPassword(password, storedHash);
      if (!ok) {
        throw new Error("INVALID_CREDENTIALS");
      }
    }

    return { id: "user_1", email, role: "user" as const };
  }

  async register(email: string, password: string, name?: string) {
    const passwordHash = await this.hashPassword(password);
    // TODO: store user + passwordHash in DB
    void passwordHash;

    return { id: "user_1", email, name, role: "user" as const };
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
