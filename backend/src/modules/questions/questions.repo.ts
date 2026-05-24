import { getOrm } from "../../db/orm.js";
import { Question } from "../../db/entities/question.entity.js";

export type QuestionRow = {
  id: number;
  chapter_id: number;
  question_text: string;
  question_type: "mcq";
  options: string[];
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
  source: "manual" | "ai";
  created_at: string;
};

export async function findQuestionsForQuiz(chapterId: number, limit: number): Promise<QuestionRow[]> {
  const em = getOrm().em.fork();
  const rows = await em.getConnection().execute<QuestionRow[]>(
    `select id, chapter_id, question_text, question_type, options, correct_answer, explanation, difficulty, source, created_at
     from questions
     where chapter_id = ?
     order by random()
     limit ?`,
    [chapterId, limit]
  );

  return rows;
}

export async function findQuestionAnswerById(questionId: number): Promise<{ id: number; correct_answer: string } | null> {
  const em = getOrm().em.fork();
  const question = await em.findOne(Question, { id: questionId });

  if (!question) {
    return null;
  }

  return {
    id: Number(question.id),
    correct_answer: question.correctAnswer
  };
}
