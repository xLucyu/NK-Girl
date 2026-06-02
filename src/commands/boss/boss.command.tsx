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
} from "@manager/cache";
import { render } from "@components/react/render";
import { componentState, scheduleComponentCleanup, ComponentState } from "@components/discord";


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
      components: components 
    });

    const message = await interaction.fetchReply();
    componentState[message.id] = state;

    scheduleComponentCleanup({
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => {
        delete componentState[message.id]
      },
    });
  }

  public abstract getEventProps(): EventCacheEntry<T, K> | null;

  protected abstract getInitialState(
    interaction: ChatInputCommandInteraction,
    eventProps: EventCacheEntry<T, K>
  ): ComponentState;

  public abstract resolveEvent(
    eventProps: EventCacheEntry<T, K>,
    state: ComponentState
  ): Promise<CurrentEventData<T, K>>;

  public abstract getProfile(
    event: CurrentEventData<T, K>,
    state: ComponentState
  ): JSX.Element;

  public abstract getComponents(
    eventProps: EventCacheEntry<T, K>,
    state: ComponentState
  ): InteractionReplyOptions["components"];
}