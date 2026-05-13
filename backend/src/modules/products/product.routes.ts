import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  listAdminProductsController,
  listCategoriesController,
  listProductsController,
  updateProductController
} from "./product.controller.js";
import {
  productIdParamsSchema,
  productListQuerySchema,
  productPayloadSchema,
  productUpdateSchema
} from "./product.schema.js";

export const publicProductRoutes = Router();
publicProductRoutes.get(
  "/",
  validate({ query: productListQuerySchema }),
  listProductsController
);
publicProductRoutes.get("/categories", listCategoriesController);
publicProductRoutes.get(
  "/:productId",
  validate({ params: productIdParamsSchema }),
  getProductController
);

export const adminProductRoutes = Router();
adminProductRoutes.use(requireAuth, requireAdmin);
adminProductRoutes.get(
  "/",
  validate({ query: productListQuerySchema }),
  listAdminProductsController
);
adminProductRoutes.post(
  "/",
  validate({ body: productPayloadSchema }),
  createProductController
);
adminProductRoutes.patch(
  "/:productId",
  validate({ params: productIdParamsSchema, body: productUpdateSchema }),
  updateProductController
);
adminProductRoutes.delete(
  "/:productId",
  validate({ params: productIdParamsSchema }),
  deleteProductController
);
