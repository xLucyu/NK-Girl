import { 
  AttachmentBuilder,
  AutocompleteInteraction, 
  ChatInputCommandInteraction, 
  InteractionReplyOptions, 
  SlashCommandSubcommandsOnlyBuilder 
} from "discord.js";
import { 
  BaseBody, 
  CurrentEventData, 
  EventCacheEntry, 
  EventType, 
  GOOGLE_API_ULRS, 
  PreviousEvent,
  eventScheduler
} from "@btd6";
import { 
  InteractionType, 
  ComponentState, 
  BaseOptions, 
  CreateComponentState, 
  getEventAutocompleteChoices, 
  componentState,
  scheduleComponentCleanup
} from "@discord";
import { addUnderscore, EventNotFound, getData } from "@lib";
import { render } from "@ui/render";


export abstract class BaseCommand<T extends BaseBody, K> {

  protected abstract readonly eventType: EventType;
  protected abstract readonly urlKey: keyof typeof GOOGLE_API_ULRS;
  public abstract commandData: SlashCommandSubcommandsOnlyBuilder;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const eventProps = this.getEventProps();
    const state = this.getIinitialState(interaction, eventProps);

    await this.renderAndReply(interaction, state);
    const message = await interaction.fetchReply();

    componentState.set(message.id, state);

    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => componentState.delete(message.id)
    });
  }

  public async renderAndReply(interaction: InteractionType, state: ComponentState): Promise<void> {

    await interaction.deferReply();

    const eventProps = this.getEventProps();
    const event = await this.resolveEvent(eventProps, state);

    if (!event) throw new EventNotFound();

    const profile = this.getProfile(event, state);
    const buffer = await render(profile);

    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    const components = this.getComponents(
      event,
      state,
      eventProps?.previousEvents ?? []
    ) ?? [];

    await interaction.editReply({
      files: [attachment],
      components
    })

  }

  protected getEventProps(): EventCacheEntry<T, K> | null {
    return eventScheduler
      .getEventCache(this.eventType)
      .getCache() as unknown as EventCacheEntry<T, K>;
  }

  protected getOptions(_interaction: ChatInputCommandInteraction): BaseOptions {
    return {};
  }

  protected getIinitialState(interaction: ChatInputCommandInteraction, eventProps: EventCacheEntry<T, K> | null): ComponentState {

    const selectedEvent = interaction.options.getString(`${interaction.commandName}_id`);
    const currentEvent = eventProps?.currentEvent.data;

    return CreateComponentState({
      event: selectedEvent ?? (currentEvent ? this.getIdentity(currentEvent) : ""),
      options: this.getOptions(interaction),
      userId: interaction.user.id
    })
  }

  public async resolveEvent(eventProps: EventCacheEntry<T, K> | null, state: ComponentState): Promise<CurrentEventData<T, K>> {

    if (eventProps && !state.event) return eventProps.currentEvent;

    if (eventProps && state.event) {
      if (this.getIdentity(eventProps.currentEvent.data) === state.event) return eventProps.currentEvent;
    }


    const key = addUnderscore(state.event || "current");
    const eventUrl = GOOGLE_API_ULRS[this.urlKey].replace("{}", key);

    return await getData<CurrentEventData<T, K>>(eventUrl);
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const focused = interaction.options.getFocused();
    const choices = await getEventAutocompleteChoices(this.eventType, focused);
    await interaction.respond(choices);
  }

  protected getComponents( 
    _event: CurrentEventData<T, K>,
    _state: ComponentState,
    _previousEvents: PreviousEvent[],
    ): InteractionReplyOptions["components"] {
      return [];
    }

  protected abstract getIdentity(data: T): string;
  public abstract getProfile(event: CurrentEventData<T, K>, state: ComponentState): JSX.Element;
}