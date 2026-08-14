import { Interaction } from "discord.js";
import { sendCommandError } from "@utils";
import { handleButton, handleModalSubmit, handleSelectMenu } from "@components";
import { checkCooldown } from "./cooldown";
import { registry } from "@client";
import { logError } from "../utils/error-handler/error.log";

const CMDCOOLDOWN = 5000;

export async function handleInteraction(interaction: Interaction): Promise<void> {

  if (interaction.isAutocomplete()) {

    const command = registry.get(interaction.commandName);

    try {
      command.autoComplete?.(interaction);
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
    await handleModalSubmit(interaction);
    } catch (error) {
     await logError(`Modal:${interaction.customId}`, error);
    }
    return;
  }
}
