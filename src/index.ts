import { DiscordClient } from "@client";
import { db } from "@database";
import { loadEmojis } from "@utils";

async function main() {
    const discordClient = new DiscordClient();
    await discordClient.start();
    await discordClient.startEventManager();
    await loadEmojis();

    const shutdown = async (signal: string) => {
        console.log(`Received ${signal}, shutting down...`);
        await db.end();
        discordClient.destroy();
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
};

main().catch(console.error);