import { discordClient, registry } from "@client";
import { allCommands } from "@commands";
import { db } from "@database";
import { loadEmojis } from "@utils";

async function main() {
  await discordClient.start();
  await discordClient.addListeners();
  await discordClient.startEventManager();
  registry.register(allCommands);
  await loadEmojis();

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    await db.end();
    discordClient.destroy();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason) => console.error("Unhandled Rejection", reason));
};

main().catch(console.error);