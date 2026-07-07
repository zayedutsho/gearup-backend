import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { auth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { authController } from "./auth.controller";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.createUser,
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.logInUser,
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  authController.getMyProfile,
);
export const authRoutes = router;
