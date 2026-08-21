import { REST, Routes } from "discord.js";
import { CONFIG } from "./config";
import { registry } from "@discord";

const rest = new REST({ version: "10" }).setToken(CONFIG.BOT_TOKEN);

export async function deployCommands({ guildId }: { guildId?: string } = {}) {

  const commands = registry.all().map(command => command.commandData.toJSON());
  
  try {
    const route = guildId ? Routes.applicationGuildCommands(CONFIG.BOT_ID, guildId)
      : Routes.applicationCommands(CONFIG.BOT_ID);

    await rest.put(route, { body: commands });

  } catch (error) {
    throw new Error("Error in deploying commands", error!);
  }
}