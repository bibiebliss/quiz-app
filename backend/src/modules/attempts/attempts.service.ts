import { getQuestionAnswer } from "../questions/questions.service.js";
import { insertAttempt } from "./attempts.repo.js";

type CreateAttemptInput = {
  userId: string;
  questionId: number;
  selectedAnswer: string;
  responseMs?: number;
  confidence?: number;
};

export async function createAttempt(input: CreateAttemptInput) {
  const question = await getQuestionAnswer(input.questionId);
  if (!question) {
    throw new Error("Question not found");
  }

  const isCorrect = question.correct_answer === input.selectedAnswer;
  const attempt = await insertAttempt({
    userId: input.userId,
    questionId: input.questionId,
    selectedAnswer: input.selectedAnswer,
    isCorrect,
    responseMs: input.responseMs,
    confidence: input.confidence
  });

  return { ...attempt, is_correct: isCorrect };
}
