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

router.post(
  "/confirm",
  auth(UserRole.CUSTOMER),
  validateRequest(paymentValidation.confirmPaymentSchema),
  paymentController.confirmPayment,
);

router.get("/", auth(UserRole.CUSTOMER), paymentController.getMyPayments);

router.get(
  "/:id",
  auth(UserRole.CUSTOMER),
  paymentController.getPaymentDetails,
);

// Stripe Webhook
router.post("/webhook", paymentController.stripeWebhook);

export const paymentRoutes = router;
