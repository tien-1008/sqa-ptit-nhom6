import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createReviewController,
  listProductReviewsController
} from "./review.controller.js";
import {
  createReviewSchema,
  productReviewParamsSchema
} from "./review.schema.js";

export const reviewRoutes = Router();
reviewRoutes.post(
  "/",
  requireAuth,
  validate({ body: createReviewSchema }),
  createReviewController
);

export const productReviewRoutes = Router({ mergeParams: true });
productReviewRoutes.get(
  "/",
  validate({ params: productReviewParamsSchema }),
  listProductReviewsController
);
