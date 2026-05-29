import { ButtonInteraction, ChatInputCommandInteraction, InteractionReplyOptions, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
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
import { buildSelectMenu } from "@components/discord/select.menu";
import { splitBossNumbers } from "@utils/helpers/regex";
import { GOOGLE_API_ULRS } from "@utils/assets/constants";
import { getData } from "@wrapper";
import { buildButtonMenu } from "@components/discord";

export type BossProps = EventCacheEntry<BossBody, Record<"Standard" | "Elite", MetaBody>>

const BOSS_SELECT_ID = "boss:event-select";
const BOSS_DIFFICULTY_ID = "boss:difficulty";

type BossState = {
  eventId: string;
  difficulty: BossDifficulty;
}

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
    );

  protected getProfile(interaction: ChatInputCommandInteraction, eventProps: BossProps): JSX.Element {

    const difficulty = interaction.options.getString("difficulty") as BossDifficulty ?? BossDifficulties[0];
    const event = eventProps.currentEvent.data;
    const metaData = eventProps.currentEvent.metaData[difficulty]

    if (!metaData) throw new Error();

    return BossProfile({
      event,
      metaData,
      difficulty
    })
  }

  protected getEventProps(): EventCacheEntry<BossBody, Record<BossDifficulty, MetaBody>> | null {
    return eventManager.getEventCache(EventType.Boss).getCache();
  }

  protected getComponents(
    eventProps: BossProps,
    selectedId?: string,
    selectedDifficulty: BossDifficulty = BossDifficulties[0]
  ): InteractionReplyOptions["components"] {

    const eventId = selectedId ?? eventProps.currentEvent.data.id;

    return [
      buildSelectMenu({
        customId: `${BOSS_SELECT_ID}:${selectedDifficulty}`,
        placeholder: "Choose a Boss Event",
        options: [
          {
            label: splitBossNumbers(eventProps.currentEvent.data.name),
            value: eventProps.currentEvent.data.id,
            default: eventId === eventProps.currentEvent.data.id,
          },
          ...eventProps.previousEvents!.map((event) => ({
            label: splitBossNumbers(event.name),
            value: event.id,
            default: eventId === event.id,
          })),
        ].slice(0, 25),
      }),

      buildButtonMenu({
        buttons: BossDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `${BOSS_DIFFICULTY_ID}:${difficulty}:${eventId}`,
          disabled: difficulty === selectedDifficulty,
        })),
      }),
    ];
  }

    protected async getProfileFromSelect(
    interaction: StringSelectMenuInteraction
  ): Promise<JSX.Element> {
    const selectedEventId = interaction.values[0];

    const [, , difficultyFromId] = interaction.customId.split(":");

    const difficulty = difficultyFromId as BossDifficulty;

    const eventURL = GOOGLE_API_ULRS.Boss.replace("{}", selectedEventId);

    const fetchingEvent = await getData<BossProps["currentEvent"]>(eventURL);

    const event = fetchingEvent.data;
    const metaData = fetchingEvent.metaData[difficulty];

    if (!metaData) throw new Error();

    return BossProfile({
      event,
      metaData,
      difficulty,
    });
  }

  protected async getProfileFromButton(
    interaction: ButtonInteraction
  ): Promise<JSX.Element> {
    const [, , difficultyFromId, selectedEventId] =
      interaction.customId.split(":");

    const difficulty = difficultyFromId as BossDifficulty;

    const eventURL = GOOGLE_API_ULRS.Boss.replace("{}", selectedEventId);

    const fetchingEvent = await getData<BossProps["currentEvent"]>(eventURL);

    const event = fetchingEvent.data;
    const metaData = fetchingEvent.metaData[difficulty];

    if (!metaData) throw new Error();

    return BossProfile({
      event,
      metaData,
      difficulty,
    });
  }
}
