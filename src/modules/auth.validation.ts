import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z.string().optional(),

  role: z.enum(["CUSTOMER", "PROVIDER"]),
});

export const loginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
