import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";

export function BuildButtonMenu(args: {
    buttons: {
        customId: string;
        label: string;
        disabled?: boolean;
    }[];
}) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        args.buttons.map((button) => 
        new ButtonBuilder()
            .setCustomId(button.customId)
            .setLabel(button.label)
            .setStyle(button.disabled ? ButtonStyle.Secondary : ButtonStyle.Primary)
            .setDisabled(button.disabled ?? false)   
        )
    )
}