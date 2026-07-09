import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/create-session",

  auth(UserRole.CUSTOMER),

  validateRequest(paymentValidation.createCheckoutSessionSchema),

  paymentController.createCheckoutSession,
);

export const paymentRoute = {
  router,
};
