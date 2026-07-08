import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { providerController } from "./provider.controller";
import { providerValidation } from "./provider.validation";

const router = Router();

router.get(
  "/orders",
  auth(UserRole.PROVIDER),
  providerController.getProviderOrders,
);

router.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  validateRequest(providerValidation.updateRentalStatusSchema),
  providerController.updateRentalStatus,
);

export const providerRoutes = router;
