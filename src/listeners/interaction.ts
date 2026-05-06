import { Interaction } from "discord.js";
import { commands } from "../commands";

export async function listener(interaction: Interaction) {

    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName as keyof typeof commands];

    await command.execute(interaction);
}
