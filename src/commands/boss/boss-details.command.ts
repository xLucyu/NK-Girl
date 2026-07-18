import { 
  Boss, 
  BossBody, 
  BossDifficulties, 
  EventType, 
} from "@utils";
import { BaseCommand } from "../base.command";
import type { BossMeta } from "./boss.command";


export class BossDetailsCommand extends BaseCommand<BossBody, BossMeta> {

  protected readonly eventType = EventType.Boss;
  protected readonly urlKey = EventType.Boss;

  public commandData = BaseCommand.baseSlashCommand("boss_details", "Check the Stats of a Boss.")
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
}
