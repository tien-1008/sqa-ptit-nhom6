import type { Response } from "express";

export function sendSuccess<T>(
  response: Response,
  message: string,
  data: T,
  statusCode = 200
): Response {
  return response.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function sendFailure(
  response: Response,
  message: string,
  data: unknown = null,
  statusCode = 400
): Response {
  return response.status(statusCode).json({
    success: false,
    message,
    data
  });
}
