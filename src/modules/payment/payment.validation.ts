import z from "zod";

const createCheckoutSessionSchema = z.object({
  rentalOrderId: z.string().uuid(),
});
const confirmPaymentSchema = z.object({
  sessionId: z.string(),
});

export const paymentValidation = {
  createCheckoutSessionSchema,
  confirmPaymentSchema,
};
