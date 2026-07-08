import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { gearController } from "./gear.controller";
import { gearValidation } from "./gear.validation";

const router = Router();

router.post(
  "/gear",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  validateRequest(gearValidation.createGearValidationSchema),
  gearController.createGear, // ✅ now complete
);

export const gearRoutes = router;
