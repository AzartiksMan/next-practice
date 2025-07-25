import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;