import { Interaction } from "discord.js";
import { commands } from ".";
import { sendCommandError } from "@utils/error-handler/error.reply";
import { handleButton, handleSelectMenu } from "@components/discord/handler";

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
    try {
      await handleSelectMenu(interaction);
    } catch (error) {
    }

    return;
  }

  if (interaction.isButton()) {
    try {
      await handleButton(interaction);
    } catch (error) {}

    return;
  }
}