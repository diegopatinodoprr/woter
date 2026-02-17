import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

export function authGuard() {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing token" } });
    }

    const token = auth.slice("Bearer ".length).trim();
    const secret = process.env.JWT_SECRET ?? "dev-secret";

    try {
      const payload = jwt.verify(token, secret) as AuthPayload;
      req.user = payload;
      return next();
    } catch {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
    }
  };
}
