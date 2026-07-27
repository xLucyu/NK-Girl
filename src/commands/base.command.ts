import { getData } from "@api";
import {
  ApplicationIntegrationType,
  AttachmentBuilder,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  StringSelectMenuInteraction
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
  CreateComponentState,
  Options
} from "@components";
import { 
  addUnderscore,
  BaseBody, 
  EventType, 
  GOOGLE_API_ULRS 
} from "@utils";
import { getEventAutocompleteChoices } from "./auto.complete";

type InteractionType = ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction;

export abstract class BaseCommand<T extends BaseBody, K> {

  protected abstract readonly eventType: EventType;
  protected abstract readonly urlKey: keyof typeof GOOGLE_API_ULRS;
  public abstract commandData: SlashCommandOptionsOnlyBuilder;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    await interaction.deferReply();

    const eventProps = this.getEventProps();
    const state = this.getInitialState(interaction, eventProps);

    await this.renderAndReply(interaction, state);
    const message = await interaction.fetchReply();

    componentState.set(message.id, state);
    
    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => componentState.delete(message.id),
    });
  }

  
  public async renderAndReply(interaction: InteractionType, state: ComponentState): Promise<void> {
    
    const eventProps = this.getEventProps();
    const event = await this.resolveEvent(eventProps, state);

    if (!event) {
      await interaction.followUp({ 
        content: `No event found for "${state.event || "current"}".`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const profile = this.getProfile(event, state);

    const buffer = await render(profile);

    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    const components = eventProps ? (this.getComponents(eventProps, state) ?? []) : [];
    await interaction.editReply({ files: [attachment], components });
  }

  protected getEventProps(): EventCacheEntry<T, K> | null {
    return eventManager 
      .getEventCache(this.eventType)
      .getCache() as unknown as EventCacheEntry<T, K> | null;
  }

  protected getOptions(_interaction: ChatInputCommandInteraction): Options {
    return {};
  }

  protected getInitialState(interaction: ChatInputCommandInteraction, eventProps: EventCacheEntry<T, K> | null): ComponentState {

    const selectedEventId = interaction.options.getString(`${interaction.commandName}_id`);

    return CreateComponentState({
      event: selectedEventId ?? eventProps?.currentEvent.data.name ?? "",
      options: this.getOptions(interaction),
      userId: interaction.user.id
    })
  }

  public async resolveEvent(eventProps: EventCacheEntry<T, K> | null, state: ComponentState): Promise<CurrentEventData<T,K> | null> {

    if (eventProps && eventProps.currentEvent.data.name === state.event) return eventProps.currentEvent;

    const key = addUnderscore(state.event || "current");
    const eventUrl = GOOGLE_API_ULRS[this.urlKey].replace("{}", key);

    try {
      return await getData<CurrentEventData<T, K>>(eventUrl);
    } catch (err) {
      return null;
    }
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const focused = interaction.options.getFocused();
    const choices = await getEventAutocompleteChoices(this.eventType, focused);

    await interaction.respond(choices);
  }

  protected getComponents( _eventProps: EventCacheEntry<T, K>,  _state: ComponentState): InteractionReplyOptions["components"] {
    return [];
  }

  protected static baseSlashCommand(name: string, description: string, autocomplete = false): SlashCommandOptionsOnlyBuilder {

    const command = new SlashCommandBuilder()
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

    if (!autocomplete) return command;

    return command.addStringOption((option) =>
      option
        .setName(`${name}_id`)
        .setDescription(`Look up previous ${name} events.`)
        .setAutocomplete(true)
        .setRequired(false),
    );
  }

  public abstract getProfile(event: CurrentEventData<T, K>, state: ComponentState): JSX.Element
}
