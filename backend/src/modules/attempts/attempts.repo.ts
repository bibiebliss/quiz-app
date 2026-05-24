import { getOrm } from "../../db/orm.js";
import { User } from "../../db/entities/user.entity.js";
import { Question } from "../../db/entities/question.entity.js";
import { UserAttempt } from "../../db/entities/user-attempt.entity.js";

type InsertAttemptInput = {
  userId: string;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  responseMs?: number;
  confidence?: number;
};

export async function insertAttempt(input: InsertAttemptInput) {
  const em = getOrm().em.fork();

  const attempt = em.create(UserAttempt, {
    user: em.getReference(User, input.userId),
    question: em.getReference(Question, input.questionId),
    selectedAnswer: input.selectedAnswer,
    isCorrect: input.isCorrect,
    responseMs: input.responseMs,
    confidence: input.confidence,
    attemptedAt: new Date(),
  });

  await em.persistAndFlush(attempt);

  return {
    id: Number(attempt.id),
    user_id: input.userId,
    question_id: input.questionId,
    selected_answer: attempt.selectedAnswer,
    is_correct: attempt.isCorrect,
    response_ms: attempt.responseMs ?? null,
    confidence: attempt.confidence ?? null,
    attempted_at: attempt.attemptedAt.toISOString()
  };
}
