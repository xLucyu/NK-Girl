import { 
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  InteractionContextType,
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { JSX } from "react";
import { eventManager } from "@manager/manager";
import { 
  EventCacheEntry,
  BossDifficulties, 
  BossDifficulty 
} from "@manager/cache";
import { BaseCommand } from "@commands/base.command";
import { BossBody, EventType, MetaBody } from "@utils/types";
import { BossProfile } from "./boss.profile";
import { splitBossNumbers } from "@utils/helpers/regex";
import { GOOGLE_API_ULRS } from "@utils/assets/constants";
import { getData } from "@wrapper";
import { BuildButtonMenu, BuildSelectMenu } from "@components/discord";
import { CreateComponentState, ComponentState } from "@components/discord/state";


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

    const difficulty = state.difficulty as BossDifficulty;

    return [
      BuildSelectMenu({
        customId: BOSS_SELECT_ID,
        placeholder: "Choose a Boss Event",
        options: [
          ...eventProps.previousEvents!.map((event) => ({
            label: splitBossNumbers(event.name),
            value: event.id,
            default: state.eventId === event.id,
          })),
        ].slice(0, 25),
      }),

      BuildButtonMenu({
        buttons: BossDifficulties.map((buttonDifficulty) => ({
          label: buttonDifficulty,
          customId: `${BOSS_DIFFICULTY_ID}:${buttonDifficulty}`,
          disabled: buttonDifficulty === difficulty,
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