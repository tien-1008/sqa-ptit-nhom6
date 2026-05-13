import { getDb } from "../../config/database.js";
import { getCart } from "../cart/cart.service.js";
import { AppError } from "../../utils/errors.js";
import type { VoucherRow } from "./voucher.model.js";
import type { CreateVoucherInput } from "./voucher.schema.js";

function serializeVoucher(row: VoucherRow) {
  return {
    id: row.id,
    code: row.code,
    description: row.description,
    discountType: row.discount_type,
    discountValue: row.discount_value,
    maxDiscount: row.max_discount,
    minOrderValue: row.min_order_value,
    usageLimit: row.usage_limit,
    usedCount: row.used_count,
    expiresAt: row.expires_at,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at
  };
}

function findVoucherByCode(code: string): VoucherRow {
  const row = getDb()
    .prepare("SELECT * FROM vouchers WHERE code = ?")
    .get(code.toUpperCase()) as VoucherRow | undefined;

  if (!row) {
    throw new AppError("Voucher code does not exist.", 404);
  }

  return row;
}

export function evaluateVoucher(code: string, subtotal: number) {
  const voucher = findVoucherByCode(code);

  if (!voucher.is_active) {
    throw new AppError("Voucher is inactive.", 409);
  }

  if (new Date(voucher.expires_at).getTime() < Date.now()) {
    throw new AppError("Voucher has expired.", 409);
  }

  if (voucher.used_count >= voucher.usage_limit) {
    throw new AppError("Voucher usage limit has been reached.", 409);
  }

  if (subtotal < voucher.min_order_value) {
    throw new AppError("Cart total does not reach voucher minimum order value.", 409);
  }

  const rawDiscount =
    voucher.discount_type === "PERCENT"
      ? Math.floor((subtotal * voucher.discount_value) / 100)
      : voucher.discount_value;

  const limitedDiscount =
    voucher.max_discount === null
      ? rawDiscount
      : Math.min(rawDiscount, voucher.max_discount);

  const discountAmount = Math.min(limitedDiscount, subtotal);

  return {
    voucherId: voucher.id,
    code: voucher.code,
    subtotal,
    discountAmount,
    finalAmount: subtotal - discountAmount
  };
}

export function applyVoucherToCart(userId: number, code: string) {
  const cart = getCart(userId);

  if (cart.items.length === 0) {
    throw new AppError("Cart is empty.", 409);
  }

  return evaluateVoucher(code, cart.totalAmount);
}

export function listVouchers() {
  const rows = getDb()
    .prepare("SELECT * FROM vouchers ORDER BY created_at DESC, id DESC")
    .all() as VoucherRow[];

  return rows.map(serializeVoucher);
}

export function createVoucher(input: CreateVoucherInput) {
  const existing = getDb()
    .prepare("SELECT id FROM vouchers WHERE code = ?")
    .get(input.code) as { id: number } | undefined;

  if (existing) {
    throw new AppError("Voucher code already exists.", 409);
  }

  const result = getDb()
    .prepare(
      `
        INSERT INTO vouchers (
          code, description, discount_type, discount_value, max_discount,
          min_order_value, usage_limit, used_count, expires_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      `
    )
    .run(
      input.code,
      input.description,
      input.discountType,
      input.discountValue,
      input.maxDiscount ?? null,
      input.minOrderValue,
      input.usageLimit,
      input.expiresAt,
      input.isActive ? 1 : 0
    );

  const created = getDb()
    .prepare("SELECT * FROM vouchers WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as VoucherRow;

  return serializeVoucher(created);
}
