import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Chapter } from "./chapter.entity.js";

@Entity({ tableName: "books" })
export class Book {
  @PrimaryKey({ autoincrement: true, type: "bigint" })
  id!: number;

  @Property({ type: "string" })
  title!: string;

  @Property({ type: "string" })
  author!: string;

  @Property({ type: "string", nullable: true })
  description?: string;

  @Property({ type: "integer", nullable: true })
  publishedYear?: number;

  @Property({ type: "datetime", defaultRaw: "now()", nullable: true})
  createdAt?: Date = new Date();

  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters = new Collection<Chapter>(this);
}
