import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) =>
  command.data.toJSON()
);

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

export async function deployCommands({ guildId }: { guildId?: string } = {}) {

  try {

    const route = guildId
      ? Routes.applicationGuildCommands(config.BOT_ID, guildId)
      : Routes.applicationCommands(config.BOT_ID);

    console.log(
      guildId
        ? `Deploying guild commands to ${guildId}...`
        : "Deploying global commands..."
    );

    await rest.put(route, {
      body: commandsData,
    });

    console.log(
      guildId
        ? "Successfully deployed guild commands."
        : "Successfully deployed global commands."
    );

  } catch (error) {
    console.error("Command deployment failed:", error);
  }
}