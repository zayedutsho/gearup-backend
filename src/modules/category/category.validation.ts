import { z } from "zod";

const createCategoryValidationSchema = z.object({
  name: z.string().min(2, "Category name is required"),

  description: z.string().optional(),
});

const updateCategoryValidationSchema = createCategoryValidationSchema.partial();

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
