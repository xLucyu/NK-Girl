import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js" 
import { getEmoji } from "@discord/emojis";

export function BuildSelectMenu(args: {
  customId: string;
  placeholder: string;
  options: { 
    label: string, 
    value: string, 
    default?: boolean,
    emoji?: string
  }[];
}) {

  const resolved = args.options.map(({ emoji, ...rest }) => ({
    ...rest,
    emoji: emoji ? getEmoji(emoji) : emoji
  }));

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(args.customId)
      .setPlaceholder(args.placeholder)
      .addOptions(resolved) 
  );
}

export function parseSelectMenu(interaction: StringSelectMenuInteraction) {
  return {
    customId: interaction.customId,
    value: interaction.values[0]
  }
}