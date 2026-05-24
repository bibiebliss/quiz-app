import { findAllBooks } from "./books.repo.js";

export async function listBooks() {
  return findAllBooks();
}
