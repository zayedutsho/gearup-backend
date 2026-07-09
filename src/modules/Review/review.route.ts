import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview,
);

router.get("/:gearId", reviewController.getGearReviews);

export const reviewRoutes = router;
