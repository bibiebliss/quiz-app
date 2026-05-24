import { getUserRetentionAgg } from "./retention.repo.js";

function scoreChapterRetention(totalAttempts: number, correctAttempts: number, avgConfidence: number | null): number {
  const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;
  const confidence = avgConfidence ? avgConfidence / 5 : 0.5;
  const raw = 100 * (0.75 * accuracy + 0.25 * confidence);
  return Math.round(raw);
}

export async function getRetentionByUser(userId: string) {
  const rows = await getUserRetentionAgg(userId);

  return rows.map((row) => {
    const totalAttempts = Number(row.total_attempts);
    const correctAttempts = Number(row.correct_attempts);
    const avgConfidence = row.avg_confidence ? Number(row.avg_confidence) : null;

    return {
      chapterId: row.chapter_id,
      chapterTitle: row.chapter_title,
      totalAttempts,
      correctAttempts,
      avgConfidence,
      retentionScore: scoreChapterRetention(totalAttempts, correctAttempts, avgConfidence),
      lastAttemptAt: row.last_attempt_at
    };
  });
}
