import { bootstrap, discordClient } from "@app";
import { db } from "@database/pool";
import { eventScheduler } from "@btd6/services";

async function main(): Promise<void> {

  await bootstrap();

  const shutdown = async (signal: string): Promise<void> => {

    console.log(`Received ${signal}, shutting down...`);

    eventScheduler.stop();
    await db.end();
    discordClient.destroy();

    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", reason => {
    console.error("Unhandled Rejection", reason);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
