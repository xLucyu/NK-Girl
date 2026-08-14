import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { BotError } from "./error.codes";
import { logError } from "./error.log";

export async function sendCommandError(interaction: ChatInputCommandInteraction, error: unknown) {

  const embed = new EmbedBuilder().setColor(Colors.Red);

  if (error instanceof BotError) {
    embed
      .setTitle(error.title)
      .setDescription(error.userMessage);
  } else {
    embed
      .setTitle("Unexpected Error")
      .setDescription(
        `Something unexpected went wrong.\nError: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

  await logError(interaction, error);

  embed.setAuthor({
    name: interaction.user.username,
    iconURL: interaction.user.displayAvatarURL(),
  });

  if (interaction.replied || interaction.deferred) {
    return interaction.editReply({ embeds: [embed] });
  }

  return interaction.reply({
    embeds: [embed]
  });
}
