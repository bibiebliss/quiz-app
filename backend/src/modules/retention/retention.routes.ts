import { Router } from "express";
import { z } from "zod";
import { getRetentionByUser } from "./retention.service.js";

const paramsSchema = z.object({
  userId: z.string().uuid()
});

export const retentionRouter = Router();

retentionRouter.get("/retention/:userId", async (req, res, next) => {
  try {
    const { userId } = paramsSchema.parse(req.params);
    const retention = await getRetentionByUser(userId);
    res.json({ data: retention });
  } catch (error) {
    next(error);
  }
});
