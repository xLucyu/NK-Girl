import { DiscordClient } from "@client";
import { loadEmojis } from "@utils";

async function main() {
    const discordClient = new DiscordClient();
    await discordClient.start();
    await discordClient.startEventManager();
    await loadEmojis();
};

main().catch(console.error);