import { z } from "zod";

export const editPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(18, "Title must be at most 18 characters"),
  text: z
    .string()
    .min(3, "Text must be at least 3 characters")
    .max(500, "Text must be at most 500 characters"),
});
