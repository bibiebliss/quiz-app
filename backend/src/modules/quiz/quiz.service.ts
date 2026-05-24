import { listQuizQuestions } from "../questions/questions.service.js";

export async function getQuiz(chapterId: number, limit: number) {
  const questions = await listQuizQuestions(chapterId, limit);
  return questions.map((q) => ({
    id: q.id,
    chapterId: q.chapter_id,
    questionText: q.question_text,
    questionType: q.question_type,
    options: q.options,
    difficulty: q.difficulty,
    source: q.source,
    explanation: q.explanation
  }));
}
