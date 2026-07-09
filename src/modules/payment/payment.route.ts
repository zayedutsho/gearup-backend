import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.post(
  "/create-session",
  auth(UserRole.CUSTOMER),
  validateRequest(paymentValidation.createCheckoutSessionSchema),
  paymentController.createCheckoutSession,
);

export const paymentRoutes = router;
