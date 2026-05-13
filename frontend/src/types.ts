export type Role = "USER" | "ADMIN";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string | null;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  totalAmount: number;
}

export interface VoucherPreview {
  voucherId: number;
  code: string;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
}

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  reviewed?: boolean;
}

export interface Order {
  id: number;
  userId: number;
  customerName?: string;
  customerEmail?: string;
  voucherId: number | null;
  voucherCode: string | null;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Review {
  id: number;
  userId: number;
  reviewerName: string;
  orderId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}
