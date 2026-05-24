import { Router } from "express";
import { z } from "zod";
import { listChaptersForBook } from "./chapters.service.js";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const chaptersRouter = Router();

chaptersRouter.get("/books/:id/chapters", async (req, res, next) => {
  try {
    const { id } = paramsSchema.parse(req.params);
    const chapters = await listChaptersForBook(id);
    res.json({ data: chapters });
  } catch (error) {
    next(error);
  }
});
