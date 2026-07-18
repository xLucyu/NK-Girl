import { Interaction } from "discord.js";
import { commands, eventCommands } from ".";
import { sendCommandError } from "@utils";
import { handleButton, handleSelectMenu } from "@components";
import { checkCooldown } from "./cooldown";

const CMDCOOLDOWN = 5000;

export async function listener(interaction: Interaction): Promise<void> {

  if (interaction.isAutocomplete()) {

    const command = eventCommands[interaction.commandName as keyof typeof eventCommands];

    try {
      command.autoComplete(interaction);
    } catch (error) {
      {
        throw new Error();
      }
    }
  }

  if (interaction.isChatInputCommand()) {

    const command = commands[interaction.commandName as keyof typeof commands];

    if (!command) return;
      try {
        checkCooldown(interaction.user.id, interaction.commandName, CMDCOOLDOWN);
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
      throw new Error();
    }
    return;
  }

  if (interaction.isButton()) {
    try {
      await handleButton(interaction);
    } catch (error) {
      throw new Error();
    }
    return;
  }
}