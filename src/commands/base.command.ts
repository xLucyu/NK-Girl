import { getData } from "@api";
import {
  ApplicationIntegrationType,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
  InteractionReplyOptions,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";
import { 
  CurrentEventData, 
  EventCacheEntry, 
  eventManager 
} from "@manager";
import { 
  render,
  componentState,
  scheduleComponentCleanup,
  ComponentState,
  CreateComponentState
} from "@components";
import { BaseBody, EventType, GOOGLE_API_ULRS } from "@utils";

export abstract class BaseCommand<T extends BaseBody, K> {

  protected abstract readonly eventType: EventType;
  protected abstract readonly urlKey: keyof typeof GOOGLE_API_ULRS;
  public abstract commandData: SlashCommandOptionsOnlyBuilder;

  public async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();
    const eventProps = this.getEventProps();
    if (!eventProps) throw new Error("no event cache found.");
  
    const state = this.getInitialState(interaction, eventProps);
    const profile = this.getProfile(eventProps.currentEvent, state);
    const buffer = await render(profile);
    const attachment = new AttachmentBuilder(buffer, {name: "image.png" });
    const components = this.getComponents(eventProps, state) ?? [];

    await interaction.editReply({
      files: [attachment], 
      components 
    });

    const message = await interaction.fetchReply();
    componentState.set(message.id, state);

    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => {
        componentState.delete(message.id);
      },
    });
  }

  public getEventProps(): EventCacheEntry<T, K> | null {
    return eventManager.getEventCache(this.eventType).getCache() as unknown as EventCacheEntry<T, K>;
  }

  protected getOptions(interaction: ChatInputCommandInteraction): Record<string, unknown> {
    return {};
  }

  public async resolveEvent(eventProps: EventCacheEntry<T, K>, state: ComponentState): Promise<CurrentEventData<T,K>> {
    
    if (eventProps.currentEvent.data.id === state.eventId) return eventProps.currentEvent;

    const eventUrl = GOOGLE_API_ULRS[this.urlKey].replace("{}", state.eventId);
    return getData<CurrentEventData<T, K>>(eventUrl);
  }

  protected getInitialState(
    interaction: ChatInputCommandInteraction, 
    eventProps: EventCacheEntry<T, K>
  ): ComponentState {
    return CreateComponentState({
      eventId: eventProps.currentEvent.data.id,
      options: this.getOptions(interaction),
      userId: interaction.user.id
    })
  }

  public abstract getProfile(event: CurrentEventData<T, K>, state: ComponentState): JSX.Element
  public abstract getComponents(
    eventProps: EventCacheEntry<T, K>, 
    state: ComponentState
  ): InteractionReplyOptions["components"]

  protected static baseSlashCommand(name: string, description: string): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)
      .setIntegrationTypes(
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
      )
      .setContexts(
        InteractionContextType.Guild,
        InteractionContextType.PrivateChannel,
      );
  }
}
