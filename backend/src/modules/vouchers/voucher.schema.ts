import { z } from "zod";

export const createVoucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(4)
      .max(20)
      .regex(/^[A-Z0-9-]+$/)
      .transform((value) => value.toUpperCase()),
    description: z.string().trim().min(5).max(240),
    discountType: z.enum(["PERCENT", "FIXED"]),
    discountValue: z.number().int().positive(),
    maxDiscount: z.number().int().positive().optional().nullable(),
    minOrderValue: z.number().int().nonnegative(),
    usageLimit: z.number().int().positive(),
    expiresAt: z.string().datetime(),
    isActive: z.boolean().default(true)
  })
  .superRefine((value, context) => {
    if (value.discountType === "PERCENT" && value.discountValue > 100) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percent discount must not exceed 100."
      });
    }
  });

export const applyVoucherSchema = z.object({
  code: z.string().trim().min(1).max(20).transform((value) => value.toUpperCase())
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
