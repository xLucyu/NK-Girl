import { DiscordClient } from "@client";

const discordClient = new DiscordClient();
discordClient.start();
discordClient.startEventManager();