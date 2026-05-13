import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  checkout,
  listAllOrders,
  listOrdersForUser,
  updateOrderStatus
} from "./order.service.js";

export const checkoutController: RequestHandler = (request, response) => {
  sendSuccess(response, "Checkout completed.", checkout(request.user!.id, request.body), 201);
};

export const myOrdersController: RequestHandler = (request, response) => {
  sendSuccess(response, "Orders loaded.", listOrdersForUser(request.user!.id));
};

export const allOrdersController: RequestHandler = (_request, response) => {
  sendSuccess(response, "Admin order list loaded.", listAllOrders());
};

export const updateOrderStatusController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Order status updated.",
    updateOrderStatus(Number(request.params.orderId), request.body.status)
  );
};
