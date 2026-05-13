import { z } from "zod";

export const productIdParamsSchema = z.object({
  productId: z.coerce.number().int().positive()
});

export const productListQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    minPrice: z.coerce.number().int().nonnegative().optional(),
    maxPrice: z.coerce.number().int().nonnegative().optional(),
    inStock: z.enum(["true", "false"]).optional()
  })
  .refine(
    (value) =>
      value.minPrice === undefined ||
      value.maxPrice === undefined ||
      value.minPrice <= value.maxPrice,
    {
      message: "minPrice must be less than or equal to maxPrice.",
      path: ["minPrice"]
    }
  );

export const productPayloadSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1500),
  price: z.number().int().min(1000),
  stock: z.number().int().min(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  imageUrl: z.string().trim().url().optional().or(z.literal(""))
});

export const productUpdateSchema = productPayloadSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field must be provided."
  });

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductPayload = z.infer<typeof productPayloadSchema>;
export type ProductUpdatePayload = z.infer<typeof productUpdateSchema>;
