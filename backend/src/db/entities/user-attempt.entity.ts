import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { Question } from "./question.entity.js";

@Entity({ tableName: "user_attempts" })
export class UserAttempt {
  @PrimaryKey({ autoincrement: true, type: "bigint" })
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Question)
  question!: Question;

  @Property({ type: "string" })
  selectedAnswer!: string;

  @Property({ type: "boolean" })
  isCorrect!: boolean;

  @Property({ type: "integer", nullable: true })
  responseMs?: number;

  @Property({ type: "integer", nullable: true })
  confidence?: number;

  @Property({ type: "datetime", defaultRaw: "now()", nullable: true })
  attemptedAt: Date = new Date();
}
