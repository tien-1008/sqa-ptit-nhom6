import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { cartRoutes } from "./modules/cart/cart.routes.js";
import {
  adminOrderRoutes,
  orderRoutes
} from "./modules/orders/order.routes.js";
import {
  adminProductRoutes,
  publicProductRoutes
} from "./modules/products/product.routes.js";
import {
  productReviewRoutes,
  reviewRoutes
} from "./modules/reviews/review.routes.js";
import {
  adminVoucherRoutes,
  voucherRoutes
} from "./modules/vouchers/voucher.routes.js";
import { sendSuccess } from "./utils/apiResponse.js";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  sendSuccess(response, "Backend is healthy.", {
    service: "sqa-ecommerce-mini-backend"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", publicProductRoutes);
app.use("/api/products/:productId/reviews", productReviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/vouchers", adminVoucherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
