import { getDb } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import type { CartItemRow } from "./cart.model.js";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.schema.js";

function getProductSnapshot(productId: number) {
  const product = getDb()
    .prepare(
      `
        SELECT id, name, price, stock, status, image_url
        FROM products
        WHERE id = ?
      `
    )
    .get(productId) as
    | {
        id: number;
        name: string;
        price: number;
        stock: number;
        status: "ACTIVE" | "INACTIVE";
        image_url: string | null;
      }
    | undefined;

  if (!product || product.status !== "ACTIVE") {
    throw new AppError("Product is not available for cart operations.", 404);
  }

  return product;
}

export function getCart(userId: number) {
  const rows = getDb()
    .prepare(
      `
        SELECT
          ci.product_id,
          ci.quantity,
          p.name,
          p.price,
          p.stock,
          p.status,
          p.image_url
        FROM cart_items ci
        INNER JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = ?
        ORDER BY ci.id ASC
      `
    )
    .all(userId) as CartItemRow[];

  const items = rows.map((row) => ({
    productId: row.product_id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    status: row.status,
    imageUrl: row.image_url,
    quantity: row.quantity,
    subtotal: row.price * row.quantity
  }));

  return {
    items,
    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0)
  };
}

export function addCartItem(userId: number, input: AddCartItemInput) {
  const product = getProductSnapshot(input.productId);
  const existing = getDb()
    .prepare(
      `
        SELECT quantity
        FROM cart_items
        WHERE user_id = ? AND product_id = ?
      `
    )
    .get(userId, input.productId) as { quantity: number } | undefined;

  const nextQuantity = (existing?.quantity ?? 0) + input.quantity;
  if (nextQuantity > product.stock) {
    throw new AppError("Cart quantity exceeds current product stock.", 409);
  }

  if (existing) {
    getDb()
      .prepare(
        `
          UPDATE cart_items
          SET quantity = ?
          WHERE user_id = ? AND product_id = ?
        `
      )
      .run(nextQuantity, userId, input.productId);
  } else {
    getDb()
      .prepare(
        `
          INSERT INTO cart_items (user_id, product_id, quantity)
          VALUES (?, ?, ?)
        `
      )
      .run(userId, input.productId, input.quantity);
  }

  return getCart(userId);
}

export function updateCartItem(
  userId: number,
  productId: number,
  input: UpdateCartItemInput
) {
  const product = getProductSnapshot(productId);
  const existing = getDb()
    .prepare("SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?")
    .get(userId, productId) as { id: number } | undefined;

  if (!existing) {
    throw new AppError("Cart item does not exist.", 404);
  }

  if (input.quantity > product.stock) {
    throw new AppError("Cart quantity exceeds current product stock.", 409);
  }

  getDb()
    .prepare(
      `
        UPDATE cart_items
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
      `
    )
    .run(input.quantity, userId, productId);

  return getCart(userId);
}

export function removeCartItem(userId: number, productId: number) {
  const result = getDb()
    .prepare("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?")
    .run(userId, productId);

  if (result.changes === 0) {
    throw new AppError("Cart item does not exist.", 404);
  }

  return getCart(userId);
}
