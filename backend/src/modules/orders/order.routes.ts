import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  allOrdersController,
  checkoutController,
  myOrdersController,
  updateOrderStatusController
} from "./order.controller.js";
import {
  checkoutSchema,
  orderIdParamsSchema,
  updateOrderStatusSchema
} from "./order.schema.js";

export const orderRoutes = Router();
orderRoutes.use(requireAuth);
orderRoutes.post("/checkout", validate({ body: checkoutSchema }), checkoutController);
orderRoutes.get("/mine", myOrdersController);

export const adminOrderRoutes = Router();
adminOrderRoutes.use(requireAuth, requireAdmin);
adminOrderRoutes.get("/", allOrdersController);
adminOrderRoutes.patch(
  "/:orderId/status",
  validate({ params: orderIdParamsSchema, body: updateOrderStatusSchema }),
  updateOrderStatusController
);
