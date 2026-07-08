import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { rentalController } from "./rental.controller";
import { rentalValidation } from "./rental.validation";

const router = Router();

// Customer Routes

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(rentalValidation.createRentalValidationSchema),
  rentalController.createRentalOrder,
);

router.get("/", auth(UserRole.CUSTOMER), rentalController.getMyRentals);

router.get("/:id", auth(UserRole.CUSTOMER), rentalController.getSingleRental);

export const rentalRoutes = router;
