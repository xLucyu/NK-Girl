import { 
  ApplicationIntegrationType,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionContextType,
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { JSX } from "react";
import { 
  eventManager,
  EventCacheEntry,
} from "@manager";
import { BaseCommand } from "../base.command";
import { BossProfile } from "./boss.profile";
import { 
  BossBody, 
  EventType, 
  MetaBody,
  splitBossNumbers,
  GOOGLE_API_ULRS,
  BossDifficulties,
  BossDifficulty
 } from "@utils";
import { getData } from "../../api/api-client";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  CreateComponentState, 
  ComponentState 
} from "@components";

export type BossCache = Record<BossDifficulty, MetaBody>;
export type BossProps = EventCacheEntry<BossBody, BossCache>;


export class BossCommand extends BaseCommand<BossBody, BossCache> {

  public commandData = new SlashCommandBuilder()
    .setName("boss")
    .setDescription("shows the boss data.")
    .addStringOption((option) =>
    option 
      .setName("difficulty")
      .setDescription("Choose a difficulty")
      .setRequired(false)
      .addChoices(
        ...BossDifficulties.map((difficulty) => ({
          name: difficulty,
          value: difficulty 
        }))
      )
    )
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    )
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )

  public getEventProps(): BossProps | null {
    return eventManager.getEventCache(EventType.Boss).getCache();
  }

  protected getInitialState(interaction: ChatInputCommandInteraction, eventProps: BossProps): ComponentState {

    const difficulty = interaction.options.getString("difficulty") as BossDifficulty ?? BossDifficulties[0];

    return CreateComponentState({
      eventId: eventProps.currentEvent.data.id,
      difficulty: difficulty,
      userId: interaction.user.id
    })
  }

  public getProfile(eventProps: BossProps["currentEvent"], state: ComponentState): JSX.Element {

    const difficulty = state.difficulty as BossDifficulty;

    const event = eventProps.data;
    const metaData = eventProps.metaData[difficulty];

    if (!metaData) throw new Error();

    return BossProfile({
      event,
      metaData,
      difficulty
    })
  }

  public getComponents(eventProps: BossProps, state: ComponentState): InteractionReplyOptions["components"] {

    return [

      BuildButtonMenu({
        buttons: BossDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `Boss:${difficulty}`,
          style: difficulty === "Elite" ? ButtonStyle.Danger : ButtonStyle.Success
        })),
      }),
      
      BuildSelectMenu({
        customId: "Boss:Select",
        placeholder: "Choose a Boss Event",
        options: [
          ...eventProps.previousEvents!.map((event) => ({
            label: splitBossNumbers(event.name),
            value: event.id,
            default: state.eventId === event.id,
            emoji: { id: "1338550202889404487", name: "BossChallenge" }
          })),
        ],
      }),
    ];
  }

  protected async fetchOtherEvent(eventId: string): Promise<BossProps["currentEvent"]> {

    const eventUrl = GOOGLE_API_ULRS.Boss.replace("{}", eventId);
    return getData<BossProps["currentEvent"]>(eventUrl);
  }

  public async resolveEvent(eventProps: BossProps, state: ComponentState): Promise<BossProps["currentEvent"]> {
    
    if (state.eventId === eventProps.currentEvent.data.id) {
      return eventProps.currentEvent;
    }

    return this.fetchOtherEvent(state.eventId);
  }
}
