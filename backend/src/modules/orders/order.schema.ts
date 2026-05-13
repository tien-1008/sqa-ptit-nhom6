import { z } from "zod";

export const checkoutSchema = z.object({
  shippingName: z.string().trim().min(2).max(120),
  shippingPhone: z.string().trim().regex(/^[0-9+()\-\s]{8,20}$/),
  shippingAddress: z.string().trim().min(10).max(240),
  voucherCode: z
    .string()
    .trim()
    .max(20)
    .transform((value) => value.toUpperCase())
    .optional()
});

export const orderIdParamsSchema = z.object({
  orderId: z.coerce.number().int().positive()
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"])
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
