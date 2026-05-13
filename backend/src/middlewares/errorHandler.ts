import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { sendFailure } from "../utils/apiResponse.js";
import { AppError } from "../utils/errors.js";

export const notFoundHandler: RequestHandler = (_request, response) => {
  sendFailure(response, "Route not found.", null, 404);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    sendFailure(response, error.message, error.details ?? null, error.statusCode);
    return;
  }

  if (error instanceof ZodError) {
    sendFailure(response, "Validation failed.", error.flatten(), 400);
    return;
  }

  console.error(error);
  sendFailure(response, "Unexpected server error.", null, 500);
};
