import { Interaction } from "discord.js";
import { sendCommandError } from "@utils";
import { handleButton, handleModalSubmit, handleSelectMenu } from "@components";
import { checkCooldown } from "./cooldown";
import { registry } from "@client";

const CMDCOOLDOWN = 5000;

export async function handleInteraction(interaction: Interaction): Promise<void> {

  if (interaction.isAutocomplete()) {

    const command = registry.get(interaction.commandName);

    try {
      command.autoComplete?.(interaction);
    } catch (error) {
      {
        throw new Error();
      }
    }
  }

  if (interaction.isChatInputCommand()) {

    const command = registry.get(interaction.commandName);

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

  if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
  }
}
