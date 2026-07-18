import {
  ButtonInteraction,
  MessageFlags,
  StringSelectMenuInteraction,
} from "discord.js";
import { componentState, TIMEOUT } from "@components";
import { BaseCommand, eventCommands } from "@commands";
import { BaseBody } from "@utils";

async function handleComponent(interaction: StringSelectMenuInteraction | ButtonInteraction) {

  const state = componentState.get(interaction.message.id);
  if (!state) return;
  
  if (interaction.user.id !== state.userId) {
    await interaction.reply({ content: "You're not the original user.", flags: MessageFlags.Ephemeral });
    return;
  }
  if (Date.now() > state.expiresAt) {
    componentState.delete(interaction.message.id);
    return;
  }

  const [commandName, value] = interaction.customId.split(":");
  const command = eventCommands[
    commandName.toLowerCase() as keyof typeof eventCommands
  ] as BaseCommand<BaseBody, unknown> | undefined;
  
  if (!command) return;

  await interaction.deferUpdate();

  if (interaction.isStringSelectMenu()) state.eventId = interaction.values[0];
  if (interaction.isButton()) state.options.difficulty = value;
  state.expiresAt = Date.now() + TIMEOUT;

  try {
    await command.renderAndReply(interaction, state);
  } catch (error) {
    console.error(`[handleComponent] ${commandName}:${value} failed:`, error);
  }
}


export async function handleSelectMenu(interaction: StringSelectMenuInteraction) {
  return handleComponent(interaction);
}

export async function handleButton(interaction: ButtonInteraction) {
  return handleComponent(interaction);
}