import { Router } from "express";
import { getQuizSchema } from "./quiz.schemas.js";
import { getQuiz } from "./quiz.service.js";

export const quizRouter = Router();

quizRouter.get("/quiz", async (req, res, next) => {
  try {
    const { chapterId, limit } = getQuizSchema.parse(req.query);
    const quiz = await getQuiz(chapterId, limit);
    res.json({ data: quiz });
  } catch (error) {
    next(error);
  }
});
