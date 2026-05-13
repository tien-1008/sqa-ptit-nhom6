import type { UserRole } from "../../types/domain.js";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
}

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
