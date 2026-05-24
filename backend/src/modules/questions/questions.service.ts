import { findQuestionAnswerById, findQuestionsForQuiz } from "./questions.repo.js";

export async function listQuizQuestions(chapterId: number, limit: number) {
  return findQuestionsForQuiz(chapterId, limit);
}

export async function getQuestionAnswer(questionId: number) {
  return findQuestionAnswerById(questionId);
}
