import {
  AttachmentBuilder,
  ButtonInteraction,
  MessageFlags,
  StringSelectMenuInteraction,
} from "discord.js";
import { componentState, render } from "@components";
import { commands, eventCommands } from "@commands";

const TIMEOUT = 3 * 60 * 1000;

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
    await interaction.reply({
      content: "This menu has expired. Run the command again.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const [commandName, value] = interaction.customId.split(":");
  const command = commands[commandName.toLowerCase() as keyof typeof eventCommands];

  if (!command || typeof command.resolveEvent !== "function") {
    await interaction.reply({
      content: "This control is no longer active.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferUpdate();

  if (interaction.isStringSelectMenu()) state.eventId = interaction.values[0];
  if (interaction.isButton()) state.difficulty = value;

  state.expiresAt = Date.now() + TIMEOUT;

  try {
    const eventProps = command.getEventProps();
    if (!eventProps) throw new Error("No event cache found.");

    const selectedEvent = await command.resolveEvent(eventProps, state);
    const profile = command.getProfile(selectedEvent, state);
    const buffer = await render(profile);
    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    const components = command.getComponents(eventProps, state) ?? [];

    await interaction.editReply({ files: [attachment], components });
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
