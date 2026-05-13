export type UserRole = "USER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
