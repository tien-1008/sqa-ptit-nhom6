import { getDb } from "../../config/database.js";
import type { OrderStatus } from "../../types/domain.js";
import { AppError } from "../../utils/errors.js";
import { evaluateVoucher } from "../vouchers/voucher.service.js";
import type { CheckoutInput } from "./order.schema.js";
import type { OrderItemRow, OrderRow } from "./order.model.js";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: []
};

export function canTransitionOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  return allowedTransitions[currentStatus].includes(nextStatus);
}

function loadOrderItems(orderId: number, reviewUserId?: number) {
  const rows = getDb()
    .prepare(
      `
        SELECT product_id, product_name, unit_price, quantity, subtotal
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
      `
    )
    .all(orderId) as OrderItemRow[];
  const reviewedProductIds =
    reviewUserId === undefined
      ? null
      : new Set(
          (
            getDb()
              .prepare(
                `
                  SELECT product_id
                  FROM reviews
                  WHERE user_id = ? AND order_id = ?
                `
              )
              .all(reviewUserId, orderId) as Array<{ product_id: number }>
          ).map((review) => review.product_id)
        );

  return rows.map((row) => ({
    productId: row.product_id,
    productName: row.product_name,
    unitPrice: row.unit_price,
    quantity: row.quantity,
    subtotal: row.subtotal,
    ...(reviewedProductIds
      ? { reviewed: reviewedProductIds.has(row.product_id) }
      : {})
  }));
}

function serializeOrder(row: OrderRow, reviewUserId?: number) {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    voucherId: row.voucher_id,
    voucherCode: row.voucher_code ?? null,
    status: row.status,
    totalAmount: row.total_amount,
    discountAmount: row.discount_amount,
    finalAmount: row.final_amount,
    shippingName: row.shipping_name,
    shippingPhone: row.shipping_phone,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    items: loadOrderItems(row.id, reviewUserId)
  };
}

function getOrderRow(orderId: number): OrderRow {
  const row = getDb()
    .prepare(
      `
        SELECT
          o.*,
          u.name AS customer_name,
          u.email AS customer_email,
          v.code AS voucher_code
        FROM orders o
        INNER JOIN users u ON u.id = o.user_id
        LEFT JOIN vouchers v ON v.id = o.voucher_id
        WHERE o.id = ?
      `
    )
    .get(orderId) as OrderRow | undefined;

  if (!row) {
    throw new AppError("Order not found.", 404);
  }

  return row;
}

export function checkout(userId: number, input: CheckoutInput) {
  const db = getDb();
  const processCheckout = db.transaction(() => {
    const cartItems = db
      .prepare(
        `
          SELECT
            ci.product_id,
            ci.quantity,
            p.name,
            p.price,
            p.stock,
            p.status
          FROM cart_items ci
          INNER JOIN products p ON p.id = ci.product_id
          WHERE ci.user_id = ?
          ORDER BY ci.id ASC
        `
      )
      .all(userId) as Array<{
      product_id: number;
      quantity: number;
      name: string;
      price: number;
      stock: number;
      status: "ACTIVE" | "INACTIVE";
    }>;

    if (cartItems.length === 0) {
      throw new AppError("Cart is empty.", 409);
    }

    cartItems.forEach((item) => {
      if (item.status !== "ACTIVE") {
        throw new AppError(`Product ${item.name} is no longer active.`, 409);
      }

      if (item.quantity > item.stock) {
        throw new AppError(`Product ${item.name} does not have enough stock.`, 409);
      }
    });

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const voucher = input.voucherCode
      ? evaluateVoucher(input.voucherCode, subtotal)
      : null;
    const discountAmount = voucher?.discountAmount ?? 0;
    const finalAmount = subtotal - discountAmount;

    const orderResult = db
      .prepare(
        `
          INSERT INTO orders (
            user_id, voucher_id, status, total_amount, discount_amount, final_amount,
            shipping_name, shipping_phone, shipping_address, payment_method
          ) VALUES (?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, 'MOCK')
        `
      )
      .run(
        userId,
        voucher?.voucherId ?? null,
        subtotal,
        discountAmount,
        finalAmount,
        input.shippingName,
        input.shippingPhone,
        input.shippingAddress
      );

    const orderId = Number(orderResult.lastInsertRowid);
    const insertOrderItem = db.prepare(
      `
        INSERT INTO order_items (
          order_id, product_id, product_name, unit_price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)
      `
    );
    const reduceStock = db.prepare(
      `
        UPDATE products
        SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    );

    cartItems.forEach((item) => {
      insertOrderItem.run(
        orderId,
        item.product_id,
        item.name,
        item.price,
        item.quantity,
        item.price * item.quantity
      );
      reduceStock.run(item.quantity, item.product_id);
    });

    if (voucher) {
      db.prepare("UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?").run(
        voucher.voucherId
      );
    }

    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(userId);
    return serializeOrder(getOrderRow(orderId), userId);
  });

  return processCheckout();
}

export function listOrdersForUser(userId: number) {
  const rows = getDb()
    .prepare(
      `
        SELECT
          o.*,
          v.code AS voucher_code
        FROM orders o
        LEFT JOIN vouchers v ON v.id = o.voucher_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC, o.id DESC
      `
    )
    .all(userId) as OrderRow[];

  return rows.map((row) => serializeOrder(row, userId));
}

export function listAllOrders() {
  const rows = getDb()
    .prepare(
      `
        SELECT
          o.*,
          u.name AS customer_name,
          u.email AS customer_email,
          v.code AS voucher_code
        FROM orders o
        INNER JOIN users u ON u.id = o.user_id
        LEFT JOIN vouchers v ON v.id = o.voucher_id
        ORDER BY o.created_at DESC, o.id DESC
      `
    )
    .all() as OrderRow[];

  return rows.map(serializeOrder);
}

export function updateOrderStatus(orderId: number, nextStatus: OrderStatus) {
  const order = getOrderRow(orderId);

  if (!canTransitionOrderStatus(order.status, nextStatus)) {
    throw new AppError(
      `Order status cannot move from ${order.status} to ${nextStatus}.`,
      409
    );
  }

  const db = getDb();
  const transaction = db.transaction(() => {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(nextStatus, orderId);

    if (nextStatus === "CANCELLED") {
      const items = loadOrderItems(orderId);
      const restoreStock = db.prepare(
        "UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      );
      items.forEach((item) => restoreStock.run(item.quantity, item.productId));
    }
  });

  transaction();
  return serializeOrder(getOrderRow(orderId));
}
