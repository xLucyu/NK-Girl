import {
  ButtonInteraction,
  MessageFlags,
  StringSelectMenuInteraction,
} from "discord.js";
import { componentState, scheduleComponentCleanup, TIMEOUT } from "@components";
import { BaseCommand, eventCommands } from "@commands";
import { BaseBody } from "@utils";

async function handleComponent(interaction: StringSelectMenuInteraction | ButtonInteraction) {

  const state = componentState.get(interaction.message.id);
  if (!state) return;

  if (interaction.user.id !== state.userId) {
    await interaction.reply({
      content: "You're not the original user.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (Date.now() > state.expiresAt) {
    componentState.delete(interaction.message.id);
    return;
  }

  const [commandKey, field, buttonValue] = interaction.customId.split(":");
  const command = eventCommands[
    commandKey as keyof typeof eventCommands
  ] as BaseCommand<BaseBody, unknown> | undefined;

  if (!command || !field) return;

  await interaction.deferUpdate();

  const value = interaction.isStringSelectMenu() ? interaction.values[0] : buttonValue;

  if (field === "eventId") {
    state.eventId = value;
  } else {
    (state.options as Record<string, unknown>)[field] = value;
  }

  state.expiresAt = Date.now() + TIMEOUT;
  componentState.set(interaction.message.id, state);

  scheduleComponentCleanup({
    messageId: interaction.message.id,
    editReply: (options) => interaction.editReply(options),
    expiresAt: state.expiresAt,
    onExpire: () => componentState.delete(interaction.message.id),
  });

  try {
    await command.renderAndReply(interaction, state);
  } catch (error) {
    await interaction.followUp({
      content: "Something went wrong. Please try again.",
      flags: MessageFlags.Ephemeral,
    });
  }
}

export async function handleSelectMenu(interaction: StringSelectMenuInteraction) {
  return handleComponent(interaction);
}

export async function handleButton(interaction: ButtonInteraction) {
  return handleComponent(interaction);
}
