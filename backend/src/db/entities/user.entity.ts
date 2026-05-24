import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string;

  @Property({ type: "string" })
  @Unique()
  email!: string;

  @Property({ type: "string" })
  displayName!: string;

  @Property({ type: "datetime", defaultRaw: "now()" })
  createdAt: Date = new Date();

  @Property({ type: "datetime", defaultRaw: "now()", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
