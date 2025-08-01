import { z } from "zod";

export const editPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters"),
  text: z
    .string()
    .trim()
    .min(3, "Text must be at least 3 characters")
    .max(500, "Text must be at most 500 characters"),
});

export type EditPostValues = z.infer<typeof editPostSchema>;
