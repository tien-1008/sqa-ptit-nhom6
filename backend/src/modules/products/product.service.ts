import { getDb } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import { toSlug } from "../../utils/slug.js";
import type { CategoryRow, ProductRow } from "./product.model.js";
import type {
  ProductListQuery,
  ProductPayload,
  ProductUpdatePayload
} from "./product.schema.js";

function serializeProduct(row: ProductRow) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    stock: row.stock,
    status: row.status,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function ensureCategoryExists(categoryId: number): void {
  const category = getDb()
    .prepare("SELECT id FROM categories WHERE id = ?")
    .get(categoryId) as { id: number } | undefined;

  if (!category) {
    throw new AppError("Product category does not exist.", 404);
  }
}

function createUniqueSlug(name: string, productId?: number): string {
  const baseSlug = toSlug(name) || "product";
  const db = getDb();
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = db
      .prepare("SELECT id FROM products WHERE slug = ?")
      .get(slug) as { id: number } | undefined;

    if (!existing || existing.id === productId) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export function listCategories() {
  const rows = getDb()
    .prepare("SELECT id, name, slug FROM categories ORDER BY name ASC")
    .all() as CategoryRow[];

  return rows;
}

interface ProductListOptions {
  includeInactive?: boolean;
}

export function listProducts(
  query: ProductListQuery,
  options: ProductListOptions = {}
) {
  const clauses = options.includeInactive ? ["1 = 1"] : ["p.status = 'ACTIVE'"];
  const params: Array<string | number> = [];

  if (query.search) {
    clauses.push("(p.name LIKE ? OR p.description LIKE ?)");
    params.push(`%${query.search}%`, `%${query.search}%`);
  }

  if (query.categoryId) {
    clauses.push("p.category_id = ?");
    params.push(query.categoryId);
  }

  if (query.minPrice !== undefined) {
    clauses.push("p.price >= ?");
    params.push(query.minPrice);
  }

  if (query.maxPrice !== undefined) {
    clauses.push("p.price <= ?");
    params.push(query.maxPrice);
  }

  if (query.inStock === "true") {
    clauses.push("p.stock > 0");
  }

  if (query.inStock === "false") {
    clauses.push("p.stock = 0");
  }

  const rows = getDb()
    .prepare(
      `
        SELECT
          p.*,
          c.name AS category_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE ${clauses.join(" AND ")}
        ORDER BY p.created_at DESC, p.id DESC
      `
    )
    .all(...params) as ProductRow[];

  return rows.map(serializeProduct);
}

export function listAdminProducts(query: ProductListQuery) {
  return listProducts(query, { includeInactive: true });
}

export function getProduct(productId: number) {
  const row = getDb()
    .prepare(
      `
        SELECT
          p.*,
          c.name AS category_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.id = ?
      `
    )
    .get(productId) as ProductRow | undefined;

  if (!row) {
    throw new AppError("Product not found.", 404);
  }

  return serializeProduct(row);
}

export function getPublicProduct(productId: number) {
  const product = getProduct(productId);

  if (product.status !== "ACTIVE") {
    throw new AppError("Product not found.", 404);
  }

  return product;
}

export function createProduct(payload: ProductPayload) {
  ensureCategoryExists(payload.categoryId);
  const slug = createUniqueSlug(payload.name);
  const result = getDb()
    .prepare(
      `
        INSERT INTO products (
          category_id, name, slug, description, price, stock, status, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      payload.categoryId,
      payload.name,
      slug,
      payload.description,
      payload.price,
      payload.stock,
      payload.status,
      payload.imageUrl || null
    );

  return getProduct(Number(result.lastInsertRowid));
}

export function updateProduct(productId: number, payload: ProductUpdatePayload) {
  const current = getProduct(productId);

  if (payload.categoryId !== undefined) {
    ensureCategoryExists(payload.categoryId);
  }

  const nextName = payload.name ?? current.name;
  const updates = {
    categoryId: payload.categoryId ?? current.categoryId,
    name: nextName,
    slug: createUniqueSlug(nextName, productId),
    description: payload.description ?? current.description,
    price: payload.price ?? current.price,
    stock: payload.stock ?? current.stock,
    status: payload.status ?? current.status,
    imageUrl:
      payload.imageUrl === undefined ? current.imageUrl : payload.imageUrl || null
  };

  getDb()
    .prepare(
      `
        UPDATE products
        SET
          category_id = ?,
          name = ?,
          slug = ?,
          description = ?,
          price = ?,
          stock = ?,
          status = ?,
          image_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    )
    .run(
      updates.categoryId,
      updates.name,
      updates.slug,
      updates.description,
      updates.price,
      updates.stock,
      updates.status,
      updates.imageUrl,
      productId
    );

  return getProduct(productId);
}

export function deleteProduct(productId: number) {
  const db = getDb();
  getProduct(productId);
  const references = db
    .prepare(
      `
        SELECT
          EXISTS(SELECT 1 FROM order_items WHERE product_id = ?) AS has_order_history,
          EXISTS(SELECT 1 FROM reviews WHERE product_id = ?) AS has_reviews
      `
    )
    .get(productId, productId) as {
    has_order_history: number;
    has_reviews: number;
  };

  if (references.has_order_history || references.has_reviews) {
    throw new AppError(
      "Product has order or review history and cannot be deleted. Set status to INACTIVE instead.",
      409
    );
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(productId);
  return { id: productId };
}
