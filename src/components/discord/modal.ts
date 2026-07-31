import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export function BuildModalMenu(parameters: {
    customId: string;
    title: string;
    inputId: string;
    inputLabel: string;
    placeholder?: string;
}) {
    const input = new TextInputBuilder()
    .setCustomId(parameters.inputId)
    .setLabel(parameters.inputLabel)
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(1)
    .setMaxLength(50);

  if (parameters.placeholder) input.setPlaceholder(parameters.placeholder);

  return new ModalBuilder()
    .setCustomId(parameters.customId)
    .setTitle(parameters.title)
    .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
}
