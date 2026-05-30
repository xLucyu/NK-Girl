import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js" 

export function BuildSelectMenu(args: {
    customId: string;
    placeholder: string;
    options: { label: string, value: string, default?: boolean }[];
}) {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(args.customId)
            .setPlaceholder(args.placeholder)
            .addOptions(args.options) 
    );
}

export function parseSelectMenu(interaction: StringSelectMenuInteraction) {
    return {
        customId: interaction.customId,
        value: interaction.values[0]
    }
}