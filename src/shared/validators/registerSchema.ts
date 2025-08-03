import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters")
    .max(12, "Username must be at most 12 characters")
    .refine((val) => !/\s/.test(val), {
      message: "Username must not contain spaces or invisible characters",
    }),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
