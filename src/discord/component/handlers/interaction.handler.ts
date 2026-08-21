import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction
} from "discord.js";
import { handleButton, handleSelectMenu } from ".";
import { registry, checkCooldown } from "@discord/command";
import { sendCommandError } from "@discord/error/error.reply";
import { logError } from "@discord/error/error.log";

export type InteractionType =
  ChatInputCommandInteraction |
  ButtonInteraction |
  StringSelectMenuInteraction |
  ModalSubmitInteraction;

export async function handleInteraction(interaction: Interaction): Promise<void> {

  if (interaction.isAutocomplete()) {

    const command = registry.get(interaction.commandName);

    if (!command.metadata?.autoComplete) return;

    try {
      await command.autoComplete?.(interaction);
    } catch (error) {
      console.error(`[Autocomplete:${interaction.commandName}]`, error);
      await interaction.respond([]).catch(() => { });
    }

    return;
  }

  if (interaction.isChatInputCommand()) {

    const command = registry.get(interaction.commandName);

    try {

      checkCooldown(
        interaction.user.id,
        interaction.commandName,
        command.metadata.cooldown
      );

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
      await logError(`[Button:${interaction.customId}]`, error);
    }

    return;
  }

  if (interaction.isModalSubmit()) {

    try {

      const commandKey = interaction.customId.split(":")[0];
      const command = registry.get(commandKey);

      await command.handleModal?.(interaction);

    } catch (error) {
      await logError(`[Modal:${interaction.customId}]`, error);
    }

    return;
  }
}