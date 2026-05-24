import { MikroORM } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config.js";

let orm: MikroORM | null = null;

export async function initOrm() {
  if (!orm) {
    orm = await MikroORM.init(config);
  }

  return orm;
}

export function getOrm() {
  if (!orm) {
    throw new Error("ORM is not initialized");
  }

  return orm;
}

export async function closeOrm() {
  if (orm) {
    await orm.close(true);
    orm = null;
  }
}
