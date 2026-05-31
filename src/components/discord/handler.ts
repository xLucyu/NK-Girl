import {
  AttachmentBuilder,
  ButtonInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { commands, eventCommands } from "@commands/index";
import { MenuState } from "@commands/base.command";
import { render } from "@components/react/render";


function isComponentExpired(state: MenuState): boolean {
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
    await interaction.reply({ content: "You're not the original user.", ephemeral: true });
    return false;
  }

  if (isComponentExpired(state)) return false;

  return true;
}

async function handleComponent(interaction: StringSelectMenuInteraction | ButtonInteraction, state: MenuState) {

  const [commandName] = interaction.customId.split(":");
  const command = commands[commandName as keyof typeof eventCommands];

  const isValid = await validateComponentInteraction(interaction, state);
  if (!isValid) return;

  await interaction.deferUpdate();

  const eventProps = command.getEventProps();

  if (!eventProps) throw new Error("No event cache found.");
  

  const selectedEvent = await command.resolveEvent(eventProps, state);
  const profile = command.getProfile(selectedEvent, state);
  const buffer = await render(profile);

  const attachment = new AttachmentBuilder(buffer, {name: "image.png" });

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