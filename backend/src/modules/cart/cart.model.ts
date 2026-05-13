export interface CartItemRow {
  product_id: number;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  image_url: string | null;
  quantity: number;
}
