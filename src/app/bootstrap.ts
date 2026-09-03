import { discordClient } from "./discord.client";
import { loadEmojis, loadCommands } from "@discord";
import { eventScheduler } from "@btd6";

export async function bootstrap(): Promise<void> {

  await loadCommands();
  await loadEmojis();
  await discordClient.addListeners();
  await discordClient.start();
  await eventScheduler.start();
}
