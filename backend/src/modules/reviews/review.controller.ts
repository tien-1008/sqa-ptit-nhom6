import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import { createReview, listReviewsByProduct } from "./review.service.js";

export const createReviewController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Review created.",
    createReview(request.user!.id, request.body),
    201
  );
};

export const listProductReviewsController: RequestHandler = (request, response) => {
  sendSuccess(
    response,
    "Product reviews loaded.",
    listReviewsByProduct(Number(request.params.productId))
  );
};
