import { z } from "zod";

export const createAttemptSchema = z.object({
  userId: z.string().uuid(),
  questionId: z.coerce.number().int().positive(),
  selectedAnswer: z.string().min(1),
  responseMs: z.coerce.number().int().min(0).optional(),
  confidence: z.coerce.number().int().min(1).max(5).optional()
});
