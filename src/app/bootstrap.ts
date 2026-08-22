import { loadEmojis} from "@discord";
import { discordClient } from "./discord.client";
import { eventScheduler } from "@btd6";
import { loadCommands } from "@discord";

export async function bootstrap(): Promise<void> {

  await loadCommands();
  await loadEmojis();
  await discordClient.start();
  await eventScheduler.start();
}