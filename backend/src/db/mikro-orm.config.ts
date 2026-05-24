import { defineConfig } from "@mikro-orm/postgresql";
import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { env } from "../config/env.js";
import { User } from "./entities/user.entity.js";
import { Book } from "./entities/book.entity.js";
import { Chapter } from "./entities/chapter.entity.js";
import { Question } from "./entities/question.entity.js";
import { UserAttempt } from "./entities/user-attempt.entity.js";

export default defineConfig({
  entities: [User, Book, Chapter, Question, UserAttempt],
  clientUrl: env.DATABASE_URL,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  dbName: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  namingStrategy: UnderscoreNamingStrategy,
  debug: env.NODE_ENV === "development",
  migrations: {
    path: "./dist/db/migrations",
    pathTs: "./src/db/migrations",
    glob: "!(*.d).{js,ts}",
    transactional: true,
    allOrNothing: true
  }
});
