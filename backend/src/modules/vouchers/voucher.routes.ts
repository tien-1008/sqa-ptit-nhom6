import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  applyVoucherController,
  createVoucherController,
  listVouchersController
} from "./voucher.controller.js";
import { applyVoucherSchema, createVoucherSchema } from "./voucher.schema.js";

export const voucherRoutes = Router();
voucherRoutes.post(
  "/apply",
  requireAuth,
  validate({ body: applyVoucherSchema }),
  applyVoucherController
);

export const adminVoucherRoutes = Router();
adminVoucherRoutes.use(requireAuth, requireAdmin);
adminVoucherRoutes.get("/", listVouchersController);
adminVoucherRoutes.post(
  "/",
  validate({ body: createVoucherSchema }),
  createVoucherController
);
