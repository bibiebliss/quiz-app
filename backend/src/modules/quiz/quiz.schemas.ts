import { z } from "zod";

export const getQuizSchema = z.object({
  bookId: z.coerce.number().int().positive().optional(),
  chapterId: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(20).default(10)
});
