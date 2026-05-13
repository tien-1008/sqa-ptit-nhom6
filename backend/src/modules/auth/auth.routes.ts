import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { loginController, meController, registerController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export const authRoutes = Router();

authRoutes.post("/register", validate({ body: registerSchema }), registerController);
authRoutes.post("/login", validate({ body: loginSchema }), loginController);
authRoutes.get("/me", requireAuth, meController);
