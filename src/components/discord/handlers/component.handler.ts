import {
  ButtonInteraction,
  MessageFlags,
  StringSelectMenuInteraction,
} from "discord.js";
import { componentState, type ComponentState, TIMEOUT } from "../state";
import { scheduleComponentCleanup } from "../cleanup";
import { applyPagination, isPagination } from "./pagination.handler";
import { guardOwnership } from "./ownership";
import { registry } from "@client";

type ComponentInteraction = StringSelectMenuInteraction | ButtonInteraction;

export async function handleSelectMenu(interaction: StringSelectMenuInteraction,): Promise<void> {
  return handleComponent(interaction);
}

export async function handleButton(interaction: ButtonInteraction): Promise<void> {
  return handleComponent(interaction);
}

async function handleComponent(interaction: ComponentInteraction): Promise<void> {

  const messageId = interaction.message.id;
  const state = componentState.get(messageId);

  if (!state) return;
  if (!(await guardOwnership(interaction, state))) return;

  if (Date.now() > state.expiresAt) {
    componentState.delete(messageId);
    return;
  }

  const parts = interaction.customId.split(":");
  const [commandKey, field, buttonValue] = parts;

  const command = registry.get(commandKey);

  if (!command?.renderAndReply || !field) {
    console.warn(`[handleComponent] no handler for customId "${interaction.customId}"`);
    return;
  }

  await interaction.deferUpdate();

  const changed = isPagination(parts)
    ? applyPagination(state, buttonValue) !== null
    : applyValue(state, interaction, field, buttonValue);

  if (!changed) return;

  refreshState(interaction, state);

  try {
    await command.renderAndReply(interaction, state);
  } catch (error) {
    console.error("[handleComponent] renderAndReply failed:", error);
    await interaction.followUp({
      content: "Something went wrong. Please try again.",
      flags: MessageFlags.Ephemeral,
    });
  }
}

/** Write a select/button value into state. Returns true if anything changed. */
function applyValue(
  state: ComponentState,
  interaction: ComponentInteraction,
  field: string,
  buttonValue: string | undefined,
): boolean {

  const value = interaction.isStringSelectMenu()
    ? interaction.values[0]
    : buttonValue;

  if (value === undefined) return false;

  if (field === "eventId") {
    if (state.event === value) return false;
    state.event = value;
    return true;
  }

  const options = state.options as Record<string, unknown>;
  if (options[field] === value) return false;

  options[field] = value;
  return true;
}

function refreshState(
  interaction: ComponentInteraction,
  state: ComponentState,
): void {

  const messageId = interaction.message.id;

  state.expiresAt = Date.now() + TIMEOUT;
  componentState.set(messageId, state);

  scheduleComponentCleanup({
    messageId,
    editReply: (options) => interaction.editReply(options),
    expiresAt: state.expiresAt,
    onExpire: () => componentState.delete(messageId),
  });
}
