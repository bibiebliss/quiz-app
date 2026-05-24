import { Router } from "express";
import { listBooks } from "./books.service.js";

export const booksRouter = Router();

booksRouter.get("/", async (_req, res, next) => {
  try {
    const books = await listBooks();
    res.json({ data: books });
  } catch (error) {
    next(error);
  }
});
