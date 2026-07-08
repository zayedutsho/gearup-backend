import z from "zod";

const rentalItemSchema = z.object({
  gearId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const createRentalValidationSchema = z.object({
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  items: z.array(rentalItemSchema).min(1),
});

export const rentalValidation = {
  createRentalValidationSchema,
  rentalItemSchema,
};
