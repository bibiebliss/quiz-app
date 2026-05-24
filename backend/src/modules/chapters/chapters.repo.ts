import { getOrm } from "../../db/orm.js";
import { Chapter } from "../../db/entities/chapter.entity.js";

export type ChapterRow = {
  id: number;
  book_id: number;
  chapter_number: number;
  title: string;
  summary: string | null;
};

export async function findChaptersByBookId(bookId: number): Promise<ChapterRow[]> {
  const em = getOrm().em.fork();
  const chapters = await em.find(
    Chapter,
    { book: bookId },
    { orderBy: { chapterNumber: "asc" }, populate: ["book"] }
  );

  return chapters.map((chapter) => ({
    id: Number(chapter.id),
    book_id: Number(chapter.book.id),
    chapter_number: chapter.chapterNumber,
    title: chapter.title,
    summary: chapter.summary ?? null
  }));
}
