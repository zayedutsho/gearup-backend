import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { gearController } from "./gear.controller";
import { gearValidation } from "./gear.validation";

const router = Router();

// POST /api/provider/gear
router.post(
  "/gear",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(gearValidation.createGearValidationSchema),
  gearController.createGear,
);

// PATCH /api/provider/gear/:id
router.patch(
  "/gear/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(gearValidation.updateGearValidationSchema),
  gearController.updateGear,
);

// DELETE /api/provider/gear/:id
router.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  gearController.deleteGear,
);

export const providerGearRoutes = router;
