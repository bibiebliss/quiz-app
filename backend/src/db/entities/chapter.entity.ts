import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Book } from "./book.entity.js";
import { Question } from "./question.entity.js";

@Entity({ tableName: "chapters" })
@Unique({ properties: ["book", "chapterNumber"] })
export class Chapter {
  @PrimaryKey({ autoincrement: true, type: "bigint" })
  id!: number;

  @ManyToOne(() => Book)
  book!: Book;

  @Property({ type: "integer" })
  chapterNumber!: number;

  @Property({ type: "string" })
  title!: string;

  @Property({ type: "string", nullable: true })
  summary?: string;

  @Property({ type: "datetime", defaultRaw: "now()", nullable: true })
  createdAt?: Date = new Date();

  @OneToMany(() => Question, (question) => question.chapter)
  questions = new Collection<Question>(this);
}
