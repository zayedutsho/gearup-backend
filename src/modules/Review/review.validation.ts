import z from "zod";

const createReviewSchema = z.object({
  gearId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
});

export const reviewValidation = {
  createReviewSchema,
};
