import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemController
} from "./cart.controller.js";
import {
  addCartItemSchema,
  cartProductParamsSchema,
  updateCartItemSchema
} from "./cart.schema.js";

export const cartRoutes = Router();
cartRoutes.use(requireAuth);
cartRoutes.get("/", getCartController);
cartRoutes.post("/items", validate({ body: addCartItemSchema }), addCartItemController);
cartRoutes.patch(
  "/items/:productId",
  validate({ params: cartProductParamsSchema, body: updateCartItemSchema }),
  updateCartItemController
);
cartRoutes.delete(
  "/items/:productId",
  validate({ params: cartProductParamsSchema }),
  removeCartItemController
);
