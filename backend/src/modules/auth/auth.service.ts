import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../../config/database.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import type { PublicUser, UserRow } from "./auth.model.js";

function publicUser(user: UserRow | PublicUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

function issueToken(user: PublicUser): string {
  return jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    {
      subject: String(user.id),
      expiresIn: "8h"
    }
  );
}

export async function register(input: RegisterInput): Promise<{
  token: string;
  user: PublicUser;
}> {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(input.email) as { id: number } | undefined;

  if (existing) {
    throw new AppError("Email is already registered.", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const result = db
    .prepare(
      `
        INSERT INTO users (email, name, password_hash, role)
        VALUES (?, ?, ?, 'USER')
      `
    )
    .run(input.email, input.name, passwordHash);

  const user = db
    .prepare(
      `
        SELECT id, email, name, role
        FROM users
        WHERE id = ?
      `
    )
    .get(Number(result.lastInsertRowid)) as PublicUser;

  return {
    token: issueToken(user),
    user
  };
}

export async function login(input: LoginInput): Promise<{
  token: string;
  user: PublicUser;
}> {
  const row = getDb()
    .prepare(
      `
        SELECT id, email, name, password_hash, role
        FROM users
        WHERE email = ?
      `
    )
    .get(input.email) as UserRow | undefined;

  if (!row || !(await bcrypt.compare(input.password, row.password_hash))) {
    throw new AppError("Email or password is incorrect.", 401);
  }

  const user = publicUser(row);
  return {
    token: issueToken(user),
    user
  };
}
