import {
  ActionRowBuilder,
  APIMessageComponentEmoji,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js" 
import { getEmoji } from "@utils";

export function BuildSelectMenu(args: {
  customId: string;
  placeholder: string;
  options: { 
    label: string, 
    value: string, 
    default?: boolean,
    emoji?: APIMessageComponentEmoji | string
  }[];
}) {

  const resolved = args.options.map(({ emoji, ...rest }) => ({
    ...rest,
    emoji: typeof emoji === "string" ? getEmoji(emoji) : emoji
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
