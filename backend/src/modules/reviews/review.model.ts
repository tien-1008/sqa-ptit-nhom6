export interface ReviewRow {
  id: number;
  user_id: number;
  reviewer_name: string;
  order_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
}
