export interface VoucherRow {
  id: number;
  code: string;
  description: string;
  discount_type: "PERCENT" | "FIXED";
  discount_value: number;
  max_discount: number | null;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
  expires_at: string;
  is_active: number;
  created_at: string;
}
