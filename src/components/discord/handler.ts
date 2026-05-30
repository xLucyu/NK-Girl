import {
  AttachmentBuilder,
  ButtonInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { commands } from "@commands/index";
import { MenuState } from "@commands/base.command";
import { render } from "@components/react/render";

export function scheduleComponentCleanup(args: {
  editReply: (options: { components: [] }) => Promise<unknown>;
  expiresAt: number; 
}) {
  const delay = Math.max(0, args.expiresAt - Date.now());

  setTimeout(() => {
    void args.editReply({ components: [] }).catch(() => {});
  }, delay);
}


export function isComponentExpired(state: MenuState): boolean {
  return Date.now() > state.expiresAt;
}


function getStateFromSelect(interaction: StringSelectMenuInteraction): MenuState {

  const [, , difficulty, userId, expiresAt] = interaction.customId.split(":");

  return {
    eventId: interaction.values[0],
    difficulty,
    userId,
    expiresAt: Number(expiresAt),
  };
}

function getStateFromButton(interaction: ButtonInteraction): MenuState {
    
  const [, , difficulty, eventId, userId, expiresAt] = interaction.customId.split(":");

  return {
    eventId,
    difficulty,
    userId,
    expiresAt: Number(expiresAt),
  };
}

async function validateComponentInteraction(
  interaction: StringSelectMenuInteraction | ButtonInteraction,
  state: MenuState
): Promise<boolean> {

  if (interaction.user.id !== state.userId) {
    await interaction.reply({
      content: "This menu is not for you.",
      ephemeral: true,
    });
    return false;
  }

  if (isComponentExpired(state)) {
    await interaction.reply({
      content: "This menu has expired. Please run the command again.",
      ephemeral: true,
    });
    return false;
  }

  return true;
}

async function handleComponent(interaction: StringSelectMenuInteraction | ButtonInteraction, state: MenuState) {

  const [commandName] = interaction.customId.split(":");
  const command = commands[commandName as keyof typeof commands];

  if (!command) return;

  const isValid = await validateComponentInteraction(interaction, state);
  if (!isValid) return;

  await interaction.deferUpdate();

  const eventProps = command.getEventProps();

  if (!eventProps) {
    throw new Error("No event cache found.");
  }

  const selectedEvent = await command.resolveEvent(eventProps, state);
  const profile = command.getProfile(selectedEvent, state);
  const buffer = await render(profile);

  const attachment = new AttachmentBuilder(buffer, {
    name: "image.png",
  });

  const components = command.getComponents(eventProps, state) ?? [];

  return interaction.editReply({
    files: [attachment],
    components,
  });
}

export async function handleSelectMenu(interaction: StringSelectMenuInteraction) {

  const state = getStateFromSelect(interaction);
  return handleComponent(interaction, state);
}

export async function handleButton(interaction: ButtonInteraction) {
  const state = getStateFromButton(interaction);
  return handleComponent(interaction, state);
}