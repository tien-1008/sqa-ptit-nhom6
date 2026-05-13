import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getDb } from "../config/database.js";
import type { AuthUser } from "../types/domain.js";
import { AppError } from "../utils/errors.js";

interface TokenPayload {
  sub: string;
}

export const requireAuth: RequestHandler = (request, _response, next) => {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!token) {
    next(new AppError("Authentication token is required.", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const row = getDb()
      .prepare(
        `
          SELECT id, email, name, role
          FROM users
          WHERE id = ?
        `
      )
      .get(Number(payload.sub)) as AuthUser | undefined;

    if (!row) {
      next(new AppError("Authenticated user no longer exists.", 401));
      return;
    }

    request.user = row;
    next();
  } catch {
    next(new AppError("Authentication token is invalid or expired.", 401));
  }
};

export const requireAdmin: RequestHandler = (request, _response, next) => {
  if (!request.user || request.user.role !== "ADMIN") {
    next(new AppError("Admin permission is required.", 403));
    return;
  }

  next();
};
