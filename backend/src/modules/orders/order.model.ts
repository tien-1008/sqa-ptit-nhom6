import type { OrderStatus } from "../../types/domain.js";

export interface OrderRow {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  voucher_id: number | null;
  voucher_code?: string | null;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
}

export interface OrderItemRow {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}
