import { findChaptersByBookId } from "./chapters.repo.js";

export async function listChaptersForBook(bookId: number) {
  return findChaptersByBookId(bookId);
}
