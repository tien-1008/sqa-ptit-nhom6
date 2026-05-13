export interface ProductRow {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
}
