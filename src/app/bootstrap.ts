import { loadEmojis} from "@discord";
import { discordClient } from "./discord.client";
import { eventScheduler } from "@btd6/services";
import { loadCommands } from "@discord/command/command.loader";

export async function bootstrap(): Promise<void> {

  await loadCommands();
  await loadEmojis();
  await discordClient.start();
  await eventScheduler.start();
}