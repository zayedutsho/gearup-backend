import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";

const router = Router();

router.use(auth(UserRole.ADMIN));

router.get("/users", adminController.getUsers);

router.patch(
  "/users/:id",
  validateRequest(adminValidation.updateUserSchema),
  adminController.updateUser,
);

router.get("/rentals", adminController.getRentals);

router.get("/gear", adminController.getGear);

export const adminRoutes = router;
