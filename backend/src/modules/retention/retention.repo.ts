import { getOrm } from "../../db/orm.js";

export type RetentionAttemptAggregateRow = {
  chapter_id: number;
  chapter_title: string;
  total_attempts: string;
  correct_attempts: string;
  avg_confidence: string | null;
  last_attempt_at: string;
};

export async function getUserRetentionAgg(userId: string): Promise<RetentionAttemptAggregateRow[]> {
  const em = getOrm().em.fork();

  const rows = await em.getConnection().execute<RetentionAttemptAggregateRow[]>(
    `select
      c.id as chapter_id,
      c.title as chapter_title,
      count(ua.id)::text as total_attempts,
      sum(case when ua.is_correct then 1 else 0 end)::text as correct_attempts,
      avg(ua.confidence)::text as avg_confidence,
      max(ua.attempted_at)::text as last_attempt_at
     from user_attempts ua
     join questions q on q.id = ua.question_id
     join chapters c on c.id = q.chapter_id
     where ua.user_id = ?
     group by c.id, c.title, c.chapter_number
     order by c.chapter_number asc`,
    [userId]
  );

  return rows;
}
