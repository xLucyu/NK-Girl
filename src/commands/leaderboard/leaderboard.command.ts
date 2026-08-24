import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { BaseLeaderboard } from "./base.leaderboard";
import { LeaderboardModeResolver } from "./modes/base.mode-resolver";
import { LeaderboardModes, leaderboardSubCommand } from "./modes";
import { Command, getEventAutocompleteChoices } from "@discord";
import { BossDifficulties, playerMultiplier } from "@btd6";

@Command({
  description: "Show Leaderboards for the current Event",
  autoComplete: false,
  cooldown: 10_000
})
export class LeaderboardCommand extends BaseLeaderboard {

  public commandData = new SlashCommandBuilder() 
    .addSubcommand((command) =>
      command
        .setName("boss")
        .setDescription("Boss Event Leaderboard")
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription("Select a Boss Event, default is the current one")
            .setAutocomplete(true)
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("difficulty")
            .setDescription("Select a Difficulty, default is Standard")
            .setRequired(false)
            .addChoices(...BossDifficulties.map((difficulty) => ({
              name: difficulty,
              value: difficulty,
            }))),
        )
        .addIntegerOption((option) =>
          option
            .setName("team_size")
            .setDescription("Select the Team Size, default is Solo")
            .setRequired(false)
            .addChoices(
              ...Object.keys(playerMultiplier).map((count) => ({
                name: `${count} Player${count === "1" ? "" : "s"}`,
                value: Number(count),
              })),
            ),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("race")
        .setDescription("Race Event Leaderboard")
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription("Select a Race Event, default is the current one")
            .setAutocomplete(true)
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("ct")
        .setDescription("CT event leaderboard")
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Player or Team")
            .setRequired(true)
            .addChoices(
              { name: "Player", value: "Player" },
              { name: "Team", value: "Team" },
            ),
          )
      .addStringOption((option) =>
          option
            .setName("event")
            .setDescription("CT event — defaults to the current event")
            .setAutocomplete(true)
            .setRequired(false),
        )
    );

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    
    const mode = this.modeFromSubcommand(interaction.options.getSubcommand(true));

    await interaction.deferReply();
    await this.buildLeaderboard(interaction, mode);
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const mode = this.modeFromSubcommand(interaction.options.getSubcommand(true));
    if (!mode) return interaction.respond([]);

    await interaction.respond(
      await getEventAutocompleteChoices(
        mode.eventType,
        interaction.options.getFocused(),
        "Leaderboard",
      ),
    );
  }
  
  private modeFromSubcommand(name: string): LeaderboardModeResolver {
    return LeaderboardModes[name as leaderboardSubCommand];
  }
}
