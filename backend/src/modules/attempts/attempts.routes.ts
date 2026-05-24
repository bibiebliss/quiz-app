import { Router } from "express";
import { createAttemptSchema } from "./attempts.schemas.js";
import { createAttempt } from "./attempts.service.js";

export const attemptsRouter = Router();

attemptsRouter.post("/attempt", async (req, res, next) => {
  try {
    const payload = createAttemptSchema.parse(req.body);
    const attempt = await createAttempt(payload);
    res.status(201).json({ data: attempt });
  } catch (error) {
    next(error);
  }
});
