import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import createCategoryValidationSchema from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(createCategoryValidationSchema),
  categoryController.createCategory,
);

export const categoryRoute = router;
