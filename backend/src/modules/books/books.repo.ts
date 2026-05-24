import { getOrm } from "../../db/orm.js";
import { Book } from "../../db/entities/book.entity.js";

export type BookRow = {
  id: number;
  title: string;
  author: string;
  description: string | null;
  published_year: number | null;
};

export async function findAllBooks(): Promise<BookRow[]> {
  const em = getOrm().em.fork();
  const books = await em.find(Book, {}, { orderBy: { id: "asc" } });

  return books.map((book) => ({
    id: Number(book.id),
    title: book.title,
    author: book.author,
    description: book.description ?? null,
    published_year: book.publishedYear ?? null
  }));
}
