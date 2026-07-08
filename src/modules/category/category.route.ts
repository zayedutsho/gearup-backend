import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidationSchema),
  categoryController.createCategory,
);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getSingleCategory);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  categoryController.updateCategory,
);

router.delete("/:id", auth(UserRole.ADMIN), categoryController.deleteCategory);

export const categoryRoute = router;
