import { Interaction } from "discord.js";
import { commands } from ".";
import { sendCommandError } from "@utils/error-handler/error.reply";

export async function listener(interaction: Interaction) {

    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName as keyof typeof commands]

    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await sendCommandError(interaction, error);
    }
}
