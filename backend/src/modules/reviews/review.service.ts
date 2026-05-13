import { getDb } from "../../config/database.js";
import { AppError } from "../../utils/errors.js";
import type { ReviewRow } from "./review.model.js";

function serializeReview(row: ReviewRow) {
  return {
    id: row.id,
    userId: row.user_id,
    reviewerName: row.reviewer_name,
    orderId: row.order_id,
    productId: row.product_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at
  };
}

export function createReview(
  userId: number,
  input: {
    orderId: number;
    productId: number;
    rating: number;
    comment: string;
  }
) {
  const db = getDb();
  const order = db
    .prepare("SELECT id, status FROM orders WHERE id = ? AND user_id = ?")
    .get(input.orderId, userId) as { id: number; status: string } | undefined;

  if (!order) {
    throw new AppError("Order does not belong to the current user.", 404);
  }

  if (order.status !== "COMPLETED") {
    throw new AppError("Only completed purchases can be reviewed.", 409);
  }

  const orderItem = db
    .prepare("SELECT id FROM order_items WHERE order_id = ? AND product_id = ?")
    .get(input.orderId, input.productId) as { id: number } | undefined;

  if (!orderItem) {
    throw new AppError("Product was not purchased in the selected order.", 409);
  }

  const duplicate = db
    .prepare(
      `
        SELECT id
        FROM reviews
        WHERE user_id = ? AND order_id = ? AND product_id = ?
      `
    )
    .get(userId, input.orderId, input.productId) as { id: number } | undefined;

  if (duplicate) {
    throw new AppError("This order item has already been reviewed.", 409);
  }

  const result = db
    .prepare(
      `
        INSERT INTO reviews (user_id, order_id, product_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(userId, input.orderId, input.productId, input.rating, input.comment);

  const row = db
    .prepare(
      `
        SELECT
          r.*,
          u.name AS reviewer_name
        FROM reviews r
        INNER JOIN users u ON u.id = r.user_id
        WHERE r.id = ?
      `
    )
    .get(Number(result.lastInsertRowid)) as ReviewRow;

  return serializeReview(row);
}

export function listReviewsByProduct(productId: number) {
  const product = getDb()
    .prepare("SELECT id FROM products WHERE id = ? AND status = 'ACTIVE'")
    .get(productId) as { id: number } | undefined;

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const rows = getDb()
    .prepare(
      `
        SELECT
          r.*,
          u.name AS reviewer_name
        FROM reviews r
        INNER JOIN users u ON u.id = r.user_id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC, r.id DESC
      `
    )
    .all(productId) as ReviewRow[];

  return rows.map(serializeReview);
}
