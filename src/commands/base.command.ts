import { JSX } from "react";
import { 
    AttachmentBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    InteractionReplyOptions,
    SlashCommandOptionsOnlyBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import { BossDifficulty, EventCacheEntry } from "../event-manager/cache";
import { render } from "@components/react/render";


export abstract class BaseCommand<T, K> {

    public abstract commandData: SlashCommandOptionsOnlyBuilder;

    public async execute(interaction: ChatInputCommandInteraction) {

        const eventProps = this.getEventProps();

        if (!eventProps) throw new Error();

        const profile = this.getProfile(interaction, eventProps);
        const buffer = await render(profile);

        const attachment = new AttachmentBuilder(buffer, { name: "image.png" });

        const components = this.getComponents?.(eventProps) ?? [];

        return interaction.reply({
            files: [attachment],
            components: components
        });
    }


    public async executeSelect(interaction: StringSelectMenuInteraction) {

        await interaction.deferUpdate();

        const eventProps = this.getEventProps();

        if (!eventProps) {
            throw new Error("No event cache found.");
        }

        const selectedId = interaction.values[0];
        const [, , difficultyFromId] = interaction.customId.split(":");
        const difficulty = difficultyFromId as BossDifficulty;

        const profile = await this.getProfileFromSelect(interaction);
        const buffer = await render(profile);

        const attachment = new AttachmentBuilder(buffer, {
            name: "image.png",
        });

        const components = this.getComponents?.(
            eventProps,
            selectedId,
            difficulty
        ) ?? [];

        return interaction.editReply({
            files: [attachment],
            components,
        });
    }
    public async executeButton(interaction: ButtonInteraction) {
        
        await interaction.deferUpdate();

        const eventProps = this.getEventProps();

        if (!eventProps) {
            throw new Error("No event cache found.");
        }

        const [, , difficultyFromId, selectedId] = interaction.customId.split(":");
        const difficulty = difficultyFromId as BossDifficulty;

        const profile = await this.getProfileFromButton(interaction);
        const buffer = await render(profile);

        const attachment = new AttachmentBuilder(buffer, {
            name: "image.png",
        });

        const components = this.getComponents?.(
            eventProps,
            selectedId,
            difficulty
        ) ?? [];

        return interaction.editReply({
            files: [attachment],
            components,
        });
    }

    protected abstract getEventProps(): EventCacheEntry<T, K> | null;
    protected abstract getProfile(interaction: ChatInputCommandInteraction, eventProps: EventCacheEntry<T,K>): JSX.Element;
    protected abstract getProfileFromSelect(interaction: StringSelectMenuInteraction): JSX.Element | Promise<JSX.Element>;
    protected abstract getProfileFromButton(interaction: ButtonInteraction): JSX.Element | Promise<JSX.Element>;
    protected getComponents?(eventProps: EventCacheEntry<T, K>, selectedId?: string, selectedDifficulty?: BossDifficulty): InteractionReplyOptions["components"];
}