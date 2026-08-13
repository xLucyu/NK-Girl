import { 
  ButtonStyle,
  ChatInputCommandInteraction, 
  InteractionReplyOptions 
} from "discord.js";
import { BaseCommand } from "../base.command";
import { BossProfile } from "./boss.profile";
import type { 
  Announcement,
  CurrentEventData, 
  EventCacheEntry, 
  PreviousEvent 
} from "@manager";
import { 
  EventType, 
  BossDifficulties,
  splitBossNumbers,
  type BossBody, 
  type MetaBody,
  type BossDifficulty
 } from "@utils";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  ComponentState, 
  BaseOptions
} from "@components";

interface BossOptions extends BaseOptions {
  difficulty: string;
}

export type BossMeta = Record<BossDifficulty, MetaBody>;
export type BossProps = EventCacheEntry<BossBody, BossMeta>;

export class BossCommand extends BaseCommand<BossBody, BossMeta> {

	protected readonly eventType = EventType.Boss;
	protected readonly urlKey = EventType.Boss;

  public commandData = BaseCommand
    .baseSlashCommand("boss", "Show Boss Event Data", true)
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

  protected getOptions(interaction: ChatInputCommandInteraction): BossOptions {
    return {
      difficulty: interaction.options.getString("difficulty") ?? BossDifficulties[0]
    };
  }

  protected getIdentity(data: BossBody): string {
    return data.name;
  }

  public buildAnnouncement(eventProps: BossProps["currentEvent"]): Announcement {
    return {
      event: eventProps.data,
      profiles: BossDifficulties.map((difficulty) => 
        BossProfile({
          event: eventProps.data,
          metaData: eventProps.metaData[difficulty],
          difficulty: difficulty
        })
      )
    };
  }

  public getProfile(eventProps: BossProps["currentEvent"], state: ComponentState): JSX.Element {

    const difficulty = state.options.difficulty as BossDifficulty;

    const event = eventProps.data;
    const metaData = eventProps.metaData[difficulty];

    if (!metaData) throw new Error();

    return BossProfile({
      event,
      metaData,
      difficulty
    })
  }

  protected getComponents(
    _event: CurrentEventData<BossBody, BossMeta>,
    state: ComponentState, 
    previousEvents: PreviousEvent[]
  ): InteractionReplyOptions["components"] {

    return [
      BuildButtonMenu({
        buttons: BossDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `boss:difficulty:${difficulty}`,
          style: difficulty === "Elite" ? ButtonStyle.Danger : ButtonStyle.Success
        })),
      }),
      
      BuildSelectMenu({
        customId: "boss:eventId:Select",
        placeholder: "Choose a Boss Event.",
        options: [
          ...previousEvents.map((event) => ({
            label: splitBossNumbers(event.name),
            value: event.name,
            default: state.event === event.name,
            emoji: "BossChallenge"
          })),
        ],
      }),
    ];
  }
}
