import type { JSX } from "react";
import { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { EventCacheEntry } from "../event.manager/cache/base";

export abstract class BaseCommand<T, K> {

    public abstract commandData: SlashCommandOptionsOnlyBuilder;

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    }

    protected abstract getProfile(): JSX.Element;
    protected abstract getEventProps(): EventCacheEntry<T, K> | null;

}
