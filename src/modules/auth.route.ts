import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { authController } from "./auth.controller";
import { registerValidationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.createUser,
);

router.post("/login", authController.logInUser);
export const authRoutes = router;
