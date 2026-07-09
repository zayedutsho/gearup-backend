import z from "zod";

const updateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
});

export const adminValidation = {
  updateUserSchema,
};
