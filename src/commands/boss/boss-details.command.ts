import { 
  ButtonStyle, 
  ChatInputCommandInteraction, 
  InteractionReplyOptions 
} from "discord.js";
import { 
  Boss, 
  BossBody, 
  BossDifficulties, 
  BossDifficulty, 
  EventType,
  playerMultiplier, 
} from "@utils";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  ComponentState, 
  Options 
} from "@components";
import { BaseCommand } from "../base.command";
import type { BossMeta, BossProps } from "./boss.command";
import { BossDetailsProfile } from "./boss-details.profile";


export class BossDetailsCommand extends BaseCommand<BossBody, BossMeta> {

  protected readonly eventType = EventType.Boss;
  protected readonly urlKey = EventType.Boss;

  public commandData = BaseCommand
    .baseSlashCommand("boss_details", "Check the Stats of a Boss.", true)
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
    .addIntegerOption((option) =>
      option
        .setName("player_count")
        .setDescription("choose a coop mode.")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(4)
      )
    .addStringOption((option) =>
      option 
        .setName("boss")
        .setDescription("Choose a difficulty")
        .setRequired(false)
        .addChoices(
          Object.values(Boss).map((boss) => ({
            name: boss,
            value: boss
          }))
        )
      )
    .addNumberOption((option) => 
      option
        .setName("hp_modifier")
        .setDescription("Custom Hp Modifier.")
        .setRequired(false)
        .setMinValue(0.1)
      )

  protected getOptions(interaction: ChatInputCommandInteraction): Options {
    return {
      difficulty: interaction.options.getString("difficulty") ?? BossDifficulties[0],
      playerCount: interaction.options.getInteger("player_count") ?? 1,
      boss: interaction.options.getString("boss") as Boss ?? null,
      hpModifier: interaction.options.getNumber("hp_modifier") ?? 1
    };
  }

  public getProfile(eventProps: BossProps["currentEvent"], state: ComponentState): JSX.Element {

    const difficulty = state.options.difficulty as BossDifficulty;

    const event = eventProps.data;
    const metaData = eventProps.metaData[difficulty];

    if (!metaData) throw new Error();

    return BossDetailsProfile({
      event,
      metaData,
      options: state.options
    })
  }

  public getComponents(eventProps: BossProps, state: ComponentState): InteractionReplyOptions["components"] {
  
    return [
      BuildButtonMenu({
        buttons: BossDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `BossDetails:${difficulty}`,
          style: difficulty === "Elite" ? ButtonStyle.Danger : ButtonStyle.Success
        })),
      }),
      
      BuildSelectMenu({
        customId: "BossDetails:Select",
        placeholder: "Choose a Coop Mode.",
        options: Object.keys(playerMultiplier).map((playerCount) => ({
          label: `${playerCount} Player${playerCount === "1" ? "" : "s"}`,
          value: playerCount,
          default: Number(playerCount) === state.options.playerCount
        }))  
      }),
    ];
  }
}