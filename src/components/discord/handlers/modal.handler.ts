import {
  ButtonInteraction,
  MessageFlags,
  ModalSubmitInteraction,
} from "discord.js";
import { componentState, TIMEOUT } from "../state";
import { scheduleComponentCleanup } from "../cleanup";
import { guardOwnership } from "./ownership";
import { registry } from "@client";

/**
 * customId conventions:
 *   Button that opens a modal:  "<command>:modal:<key>"
 *   The modal itself:           "<command>:modal:<key>:submit"
 *   The text input inside it:   "input"
 */

export function isModal(parts: string[]): boolean {
  return parts[1] === "modal";
}

/**
 * Button click → show the modal.
 * Must NOT defer first: showModal() has to be the initial response.
 */
export async function handleModalOpen(
  interaction: ButtonInteraction,
  parts: string[],
): Promise<void> {

  const [commandKey, , key] = parts;
  if (!key) return;

  const state = componentState.get(interaction.message.id);
  if (!state) return;

  if (!(await guardOwnership(interaction, state))) return;

  const command = registry.get(commandKey);
  if (!command?.buildModal) return;

  const modal = command.buildModal(key);
  if (!modal) return;

  await interaction.showModal(modal);
}

/** Modal submitted → let the command mutate state, then re-render. */
export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {

  const parts = interaction.customId.split(":");
  if (!isModal(parts) || parts[3] !== "submit") return;

  const [commandKey, , key] = parts;

  const messageId = interaction.message?.id;
  if (!messageId) return;

  const state = componentState.get(messageId);

  if (!state) {
    await interaction.reply({
      content: "This message has expired. Please run the command again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (!(await guardOwnership(interaction, state))) return;

  if (Date.now() > state.expiresAt) {
    componentState.delete(messageId);
    await interaction.reply({
      content: "This message has expired. Please run the command again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const command = registry.get(commandKey);
  if (!command?.handleModal || !command.renderAndReply) return;

  const input = interaction.fields.getTextInputValue("input");
  const changed = command.handleModal(state, key, input);

  if (!changed) {
    await interaction.reply({
      content: `No result found for \`${input}\`.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferUpdate();

  state.expiresAt = Date.now() + TIMEOUT;
  componentState.set(messageId, state);

  scheduleComponentCleanup({
    messageId,
    editReply: (options) => interaction.editReply(options),
    expiresAt: state.expiresAt,
    onExpire: () => componentState.delete(messageId),
  });

  await command.renderAndReply(interaction, state);
}
