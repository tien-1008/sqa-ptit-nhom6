import type { RequestHandler } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { login, register } from "./auth.service.js";

export const registerController: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await register(request.body);
    sendSuccess(response, "Registration completed.", result, 201);
  }
);

export const loginController: RequestHandler = asyncHandler(
  async (request, response) => {
    const result = await login(request.body);
    sendSuccess(response, "Login completed.", result);
  }
);

export const meController: RequestHandler = (request, response) => {
  sendSuccess(response, "Authenticated user loaded.", request.user);
};
