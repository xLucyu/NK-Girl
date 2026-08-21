import {
  ButtonInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import type { ComponentState } from "./component.state";

type GuardableInteraction =
  | ButtonInteraction
  | StringSelectMenuInteraction
  | ModalSubmitInteraction;

export async function guardOwnership(interaction: GuardableInteraction, state: ComponentState,): Promise<boolean> {

  if (interaction.user.id === state.userId) return true;

  await interaction.reply({
    content: "You're not the original user.",
    flags: MessageFlags.Ephemeral,
  });

  return false;
}