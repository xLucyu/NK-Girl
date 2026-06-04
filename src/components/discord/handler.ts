import { 
  AttachmentBuilder, 
  ButtonInteraction, 
  StringSelectMenuInteraction 
} from "discord.js";
import { componentState, ComponentState, render } from "@components";
import { commands, eventCommands } from "@commands";


function isComponentExpired(state: ComponentState): boolean {
  return Date.now() > state.expiresAt;
}


function getStateFromInteraction(interaction: StringSelectMenuInteraction | ButtonInteraction): ComponentState | undefined {
  return componentState[interaction.message.id];
}


async function validateComponentInteraction(
  interaction: StringSelectMenuInteraction | ButtonInteraction,
  state: ComponentState
): Promise<boolean> {

  if (interaction.user.id !== state.userId) {
    await interaction.reply({content: "You're not the original user.", ephemeral: true });
    return false;
  }

  if (isComponentExpired(state)) {
    delete componentState[interaction.message.id];
    return false;
  }
  return true;
}


async function handleComponent(interaction: StringSelectMenuInteraction | ButtonInteraction) {

  const state = getStateFromInteraction(interaction);
  if (!state) return;

  const isValid = await validateComponentInteraction(interaction, state);
  if (!isValid) return;

  const [commandName, value] = interaction.customId.split(":");

  if (interaction.isStringSelectMenu()) state.eventId = interaction.values[0];
  if (interaction.isButton()) state.difficulty = value;
  
  const command = commands[commandName as keyof typeof eventCommands];
  if (!command) throw new Error(`Command not found: ${commandName}`);
  
  await interaction.deferUpdate();

  const eventProps = command.getEventProps();
  if (!eventProps) throw new Error("No event cache found.");
  
  const selectedEvent = await command.resolveEvent(eventProps, state);
  const profile = command.getProfile(selectedEvent, state);
  const buffer = await render(profile);
  const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
  const components = command.getComponents(eventProps, state) ?? [];

  await interaction.editReply({
    files: [attachment],
    components,
  });
}

export async function handleSelectMenu(interaction: StringSelectMenuInteraction) {
  return handleComponent(interaction);
}
export async function handleButton(interaction: ButtonInteraction) {
  return handleComponent(interaction);
}
