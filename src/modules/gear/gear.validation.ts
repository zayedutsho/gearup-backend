import z from "zod";

const createGearValidationSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  brand: z.string().min(2),
  pricePerDay: z.number().positive(),
  stock: z.number().int().min(0),
  image: z.string().url().optional(),
  categoryId: z.string().uuid(),
});

const updateGearValidationSchema = createGearValidationSchema.partial();

export const gearValidation = {
  updateGearValidationSchema,
  createGearValidationSchema,
};
