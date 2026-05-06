import type { JSX } from "react";
import { 
    AttachmentBuilder,
    ChatInputCommandInteraction,
    SlashCommandOptionsOnlyBuilder
} from "discord.js";
import { EventCacheEntry } from "../event.manager/cache/base";
import { render } from "../components/render";

export abstract class BaseCommand<T, K> {

    public abstract commandData: SlashCommandOptionsOnlyBuilder;

    public async execute(interaction: ChatInputCommandInteraction) {

        const eventProps = this.getEventProps();

        console.log(eventProps);

        if (!eventProps) throw new Error();

        const profile = this.getProfile();
        const buffer = await render(profile);

        const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
        return interaction.reply({
            files: [attachment], 
        });
    }

    protected abstract getEventProps(): EventCacheEntry<T, K> | null;
    protected abstract getProfile(): JSX.Element;
}
