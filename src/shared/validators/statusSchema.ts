import { z } from "zod";

export const statusSchema = z.object({
  status: z.string().min(1, "Status is required").max(24, "Max 24 characters"),
});

export type StatusFormData = z.infer<typeof statusSchema>;
