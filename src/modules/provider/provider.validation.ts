import z from "zod";

const updateRentalStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"]),
});

export const providerValidation = {
  updateRentalStatusSchema,
};
