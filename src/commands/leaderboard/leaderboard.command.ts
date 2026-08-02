import {
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import { BaseLeaderboard } from "./base.leaderboard";
import {
  BossDifficulties,
  playerMultiplier,
} from "@utils";
import { BossLeaderboard, CTLeaderboard, RaceLeaderboard } from "./modes";
import { getEventAutocompleteChoices } from "../auto.complete";

export class LeaderboardCommand {

  private readonly modes = {
    boss: new BossLeaderboard(),
    race: new RaceLeaderboard(),
    ct: new CTLeaderboard()
  }

  public commandData = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show Leaderboard Data.")
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    )
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
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
              value: difficulty 
            }))),
        )
        .addIntegerOption((option) =>
          option
            .setName("team_size")
            .setDescription(`Select the Team Size, default is Solo}`)
            .setRequired(false)
            .addChoices(
              ...Object.keys(playerMultiplier).map((count) => ({
                name: `${count} Player${count === "1" ? "" : "s"}`,
                value: Number(count),
              })),
            ),
        )
      )
    .addSubcommand((command) =>
      command
          .setName("race")
          .setDescription("Race Event Leaderboard")
          .addStringOption((option) =>
            option
              .setName("event")
              .setDescription("Select a Boss Event, default is the current one")
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
            .setName("event")
            .setDescription("CT event — defaults to the current event")
            .setAutocomplete(true)
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Player or Team")
            .setRequired(true)
            .addChoices(
              { name: "Player", value: "Player" },
              { name: "Team", value: "Team" },
            ),
        ),
    )

  public async execute(interaction: ChatInputCommandInteraction) { 
    const mode = this.modes[interaction.options.getSubcommand(true) as keyof typeof this.modes];
    await mode.execute(interaction);
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const mode = this.modes[interaction.options.getSubcommand(true) as keyof typeof this.modes];

    await interaction.respond(await getEventAutocompleteChoices(
      mode.eventType, 
      interaction.options.getFocused(),
    ));
  }
}
