import { 
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { JSX } from "react";
import { 
  eventManager,
  EventCacheEntry,
  BossDifficulties, 
  BossDifficulty 
} from "@manager";
import { BaseCommand } from "@commands";
import { 
  BossBody, 
  EventType, 
  MetaBody,
  splitBossNumbers,
  GOOGLE_API_ULRS
 } from "@utils";
import { BossProfile } from "./boss.profile";
import { getData } from "@wrapper";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  CreateComponentState, 
  ComponentState 
} from "@components";


export type BossProps = EventCacheEntry<BossBody, Record<"Standard" | "Elite", MetaBody>>

const BOSS_SELECT_ID = "boss:event-select";
const BOSS_DIFFICULTY_ID = "boss:event-button";


export class BossCommand extends BaseCommand<BossBody, Record<BossDifficulty, MetaBody>> {

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


  public getEventProps(): EventCacheEntry<BossBody, Record<BossDifficulty, MetaBody>> | null {
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


  public getComponents(eventProps: BossProps, state: ComponentState): InteractionReplyOptions["components"] {

    return [
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
      BuildButtonMenu({
        buttons: BossDifficulties.map((buttonDifficulty) => ({
          label: buttonDifficulty,
          customId: `Boss:Button:${buttonDifficulty}`,
        })),
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
