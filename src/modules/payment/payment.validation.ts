import z from "zod";

const createCheckoutSessionSchema = z.object({
  rentalOrderId: z.string().uuid(),
});

export const paymentValidation = {
  createCheckoutSessionSchema,
};
