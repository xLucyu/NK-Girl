import { 
  ButtonStyle,
  ChatInputCommandInteraction, 
  InteractionReplyOptions 
} from "discord.js";
import type { EventCacheEntry } from "@manager";
import { BaseCommand } from "../base.command";
import { BossProfile } from "./boss.profile";
import { 
  BossBody, 
  EventType, 
  MetaBody,
  splitBossNumbers,
  BossDifficulties,
  BossDifficulty
 } from "@utils";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  ComponentState, 
  Options
} from "@components";

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

  protected getOptions(interaction: ChatInputCommandInteraction): Options {
    return {
      difficulty: interaction.options.getString("difficulty") ?? BossDifficulties[0]
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
            value: event.name,
            default: state.eventId === event.id,
            emoji: { id: "1338550202889404487", name: "BossChallenge" }
          })),
        ],
      }),
    ];
  }
}