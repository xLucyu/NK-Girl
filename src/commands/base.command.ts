import { JSX } from "react";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import {
  CurrentEventData,
  EventCacheEntry,
} from "../event-manager/cache";

import { render } from "@components/react/render";
import { scheduleComponentCleanup } from "@components/discord/handler";

export type MenuState = {
  eventId: string;
  difficulty: string;
  userId: string;
  expiresAt: number;
};

export abstract class BaseCommand<T, K> {
  public abstract commandData: SlashCommandOptionsOnlyBuilder;

  public async execute(interaction: ChatInputCommandInteraction) {

    const eventProps = this.getEventProps();

    if (!eventProps) throw new Error("no event cache found.");
    
    const state = this.getInitialState(interaction, eventProps);

    const profile = this.getProfile(eventProps.currentEvent, state);
    const buffer = await render(profile);

    const attachment = new AttachmentBuilder(buffer, {name: "image.png" });

    const components = this.getComponents(eventProps, state) ?? [];

    await interaction.reply({
      files: [attachment],
      components,
    });

    scheduleComponentCleanup({
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt
    });
  }

  public abstract getEventProps(): EventCacheEntry<T, K> | null;

  protected abstract getInitialState(
    interaction: ChatInputCommandInteraction,
    eventProps: EventCacheEntry<T, K>
  ): MenuState;

  public abstract resolveEvent(
    eventProps: EventCacheEntry<T, K>,
    state: MenuState
  ): Promise<CurrentEventData<T, K>>;

  public abstract getProfile(
    event: CurrentEventData<T, K>,
    state: MenuState
  ): JSX.Element;

  public abstract getComponents(
    eventProps: EventCacheEntry<T, K>,
    state: MenuState
  ): InteractionReplyOptions["components"];
}