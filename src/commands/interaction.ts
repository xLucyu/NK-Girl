import { Interaction } from "discord.js";
import { commands } from ".";
import { sendCommandError } from "@utils/error-handler/error.reply";

export async function listener(interaction: Interaction): Promise<void> {

    if (interaction.isChatInputCommand()) {

        const command = commands[interaction.commandName as keyof typeof commands]

        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            await sendCommandError(interaction, error);
        }
        return;
    }

    if (interaction.isStringSelectMenu()) {

        const [commandName] = interaction.customId.split(":");

        const command = commands[commandName as keyof typeof commands];

        if (!command) return;

        try {
        await command.executeSelect(interaction);
        } catch (error) {
            }

        return;
    }

    if (interaction.isButton()) {
        const [commandName] = interaction.customId.split(":");

        const command = commands[commandName as keyof typeof commands];

        if (!command || !("executeButton" in command)) return;

        try {
            await command.executeButton(interaction);
        } catch (error) {}
    return;
    }
}