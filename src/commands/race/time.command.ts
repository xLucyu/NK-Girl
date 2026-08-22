
import { calculateGoal, calculateSend, TimeCalculation } from "@btd6";
import { Command, getEmoji } from "@discord";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

@Command({
  description: "Calculate your Race Time",
  autoComplete: false
})
export class TimeCommand {

  public commandData = new SlashCommandBuilder()
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription("Calculate the time you will get.")
        .addIntegerOption((option) =>
          option
            .setName("start_round")
            .setDescription("Choose the round you're starting on.")
            .setMinValue(0)
            .setMaxValue(139)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("end_round")
            .setDescription("Choose the round you're sending to.")
            .setMinValue(1)
            .setMaxValue(140)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription("Sending time. Examples: 45 | 1:25 | 45.25 | 1:25.45")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("abr")
            .setDescription("Use Alternate Bloons Rounds.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goal")
        .setDescription("Calculate when to full send for your desired time.")
        .addIntegerOption((option) =>
          option
            .setName("start_round")
            .setDescription("Choose the round you want to full send from.")
            .setMinValue(0)
            .setMaxValue(139)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("end_round")
            .setDescription("Choose the round you're trying to send to.")
            .setMinValue(1)
            .setMaxValue(140)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("goal_time")
            .setDescription("Choose the time you want to achieve.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("abr")
            .setDescription("Use Alternate Bloons Rounds.")
        )
    );

  private buildEmbed(result: TimeCalculation): EmbedBuilder {

    const emoji = getEmoji("Round");
    const roundEmoji = emoji ? `<:${emoji.name}:${emoji.id}>` : "";

    const calculated = [
      result.calculatedTime,
      ...result.laterRounds
    ].join("\n");

    return new EmbedBuilder()
      .setTitle(result.title)
      .setColor("Blue")
      .addFields(
        {
          name: "Rounds",
          value: `${roundEmoji} ${result.startRound} -> ${result.endRound}`,
          inline: false,
        },
        {
          name: "Longest Round",
          value: `${roundEmoji} ${result.longestRound}`,
          inline: false,
        },
        {
          name: "Round Set",
          value: result.roundSet,
          inline: false,
        },
        {
          name: result.inputLabel,
          value: `**${result.inputTime}**`,
          inline: false,
        },
        {
          name: "Calculated Time",
          value: calculated,
          inline: false,
        }
      )
      .setFooter({
        text: "*Times ending on: 2, 4, 7 or 9 will be reduced by 1 frame."
      });
  }

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const subcommand = interaction.options.getSubcommand();

    const startRound = interaction.options.getInteger("start_round", true);
    const endRound = interaction.options.getInteger("end_round", true);
    const abr = interaction.options.getBoolean("abr") ?? false;

    let result: TimeCalculation;

    if (subcommand === "send") {

      result = calculateSend(
        startRound,
        endRound,
        interaction.options.getString("time", true),
        abr
      );

    } else {

      result = calculateGoal(
        startRound,
        endRound,
        interaction.options.getString("goal_time", true),
        abr
      );
    }

    await interaction.reply({
      embeds: [this.buildEmbed(result)]
    });
  }
}
