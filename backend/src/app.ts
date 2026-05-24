import express from "express";
import { booksRouter } from "./modules/books/books.routes.js";
import { chaptersRouter } from "./modules/chapters/chapters.routes.js";
import { quizRouter } from "./modules/quiz/quiz.routes.js";
import { attemptsRouter } from "./modules/attempts/attempts.routes.js";
import { retentionRouter } from "./modules/retention/retention.routes.js";
import { docsRouter } from "./docs/docs.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/books", booksRouter);
app.use(chaptersRouter);
app.use(quizRouter);
app.use(attemptsRouter);
app.use(retentionRouter);
app.use(docsRouter);

app.use(errorHandler);
