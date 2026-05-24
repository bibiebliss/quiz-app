import "reflect-metadata";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeOrm, initOrm } from "./db/orm.js";

async function bootstrap() {
  await initOrm();

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await closeOrm();
      process.exit(0);
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server", error);
  await closeOrm();
  process.exit(1);
});
