import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Chapter } from "./chapter.entity.js";

@Entity({ tableName: "questions" })
export class Question {
  @PrimaryKey({ autoincrement: true, type: "bigint" })
  id!: number;

  @ManyToOne(() => Chapter)
  chapter!: Chapter;

  @Property({ type: "string" })
  questionText!: string;

  @Property({ type: "string", default: "mcq" })
  questionType: "mcq" = "mcq";

  @Property({ type: "json" })
  options!: string[];

  @Property({ type: "string" })
  correctAnswer!: string;

  @Property({ type: "string", nullable: true })
  explanation?: string;

  @Property({ type: "integer", default: 2 })
  difficulty = 2;

  @Property({ type: "string", default: "manual" })
  source: "manual" | "ai" = "manual";

  @Property({ type: "datetime", defaultRaw: "now()", nullable: true })
  createdAt?: Date = new Date();
}
