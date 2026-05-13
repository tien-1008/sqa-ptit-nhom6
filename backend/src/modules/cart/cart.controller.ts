import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem
} from "./cart.service.js";

export const getCartController: RequestHandler = (request, response) => {
  sendSuccess(response, "Cart loaded.", getCart(request.user!.id));
};

export const addCartItemController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Cart item added.",
    addCartItem(request.user!.id, request.body),
    201
  );
};

export const updateCartItemController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Cart item updated.",
    updateCartItem(
      request.user!.id,
      Number(request.params.productId),
      request.body
    )
  );
};

export const removeCartItemController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Cart item removed.",
    removeCartItem(request.user!.id, Number(request.params.productId))
  );
};
