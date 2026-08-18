import { Interaction } from "discord.js";
import { sendCommandError, logError } from "@utils";
import { checkCooldown } from "./cooldown";
import { registry } from "@client";
import { handleButton, handleSelectMenu } from "@components";
import { usageTable } from "@database";

const CMDCOOLDOWN = 5000;

export async function handleInteraction(interaction: Interaction): Promise<void> {

  if (interaction.isAutocomplete()) {

    const command = registry.get(interaction.commandName);

    try {
      await command.autoComplete?.(interaction);
    } catch (error) {
      console.error(`[Autocomplete:${interaction.commandName}]`, error);
      await interaction.respond([]).catch(() => {});
    }
  }

  if (interaction.isChatInputCommand()) {

    const command = registry.get(interaction.commandName);

    if (!command) return;
      try {
        checkCooldown(interaction.user.id, interaction.commandName, CMDCOOLDOWN);
        await command.execute(interaction);
        await usageTable.increaseCommandUsage(interaction.commandName);
      } catch (error) {
        await sendCommandError(interaction, error);
      }
      return;
  }

  if (interaction.isStringSelectMenu()) {
    try {
      await handleSelectMenu(interaction);
    } catch (error) {
      await logError(`[SelectMenu:${interaction.customId}]`, error);
    }
    return;
  }

  if (interaction.isButton()) {
    try {
      await handleButton(interaction);
    } catch (error) {
      await logError(`Button:${interaction.customId}`, error);

    }
    return;
  }

  if (interaction.isModalSubmit()) {
    try {
      const commandKey = interaction.customId.split(":")[0];
      const command = registry.get(commandKey);
      await command.handleModal?.(interaction);
    } catch (error) {
     await logError(`Modal:${interaction.customId}`, error);
    }
    return;
  }
}
