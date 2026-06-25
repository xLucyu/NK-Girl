import { SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../base.command";
import { 
  Boss, 
  BossBody, 
  BossDifficulties, 
  MetaData 
} from "@utils";


export class BossDetailsCommand extends BaseCommand<BossBody, MetaData> {

    public commandData = new SlashCommandBuilder()
        .setName("bossdetails")
        .setDescription("Show the Hp Values of a boss, default is the current one.")
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
