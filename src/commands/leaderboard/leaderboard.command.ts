import { BaseBody, BossDifficulties, EventType, playerMultiplier } from "@utils";
import { BaseCommand } from "../base.command"
import { ApplicationIntegrationType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { BaseLeaderboard, LeaderboardConfig } from "./base.leaderboard";
import { getEventAutocompleteChoices } from "../auto.complete";

export class LeaderboardCommand extends BaseLeaderboard {

  public commandData = new SlashCommandBuilder()
      .setName("leaderboard")
      .setDescription("Show a leaderboard for a Boss, Race, or CT event.")
      .setIntegrationTypes(
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
      )
      .setContexts(
        InteractionContextType.Guild,
        InteractionContextType.PrivateChannel,
      )
      .addSubcommand((sub) =>
        sub
          .setName("boss")
          .setDescription("Boss event leaderboard")
          .addStringOption((o) =>
            o.setName("event")
              .setDescription("Boss event name")
              .setAutocomplete(true)
              .setRequired(true),
          )
          .addStringOption((o) =>
            o.setName("difficulty")
              .setDescription("Boss difficulty")
              .setRequired(true)
              .addChoices(
                ...BossDifficulties.map((d) => ({ name: d, value: d })),
              ),
          )
          .addIntegerOption((o) =>
            o.setName("team_size")
              .setDescription("Team size (1-4)")
              .setRequired(true)
              .addChoices(
                ...Object.keys(playerMultiplier).map((count) => ({
                  name: `${count} Player${count === "1" ? "" : "s"}`,
                  value: Number(count),
                })),
              ),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("race")
          .setDescription("Race event leaderboard")
          .addStringOption((o) =>
            o.setName("event")
              .setDescription("Race event name")
              .setAutocomplete(true)
              .setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("ct")
          .setDescription("CT event leaderboard")
          .addStringOption((o) =>
            o.setName("event")
              .setDescription("CT event number")
              .setAutocomplete(true)
              .setRequired(true),
          )
          .addStringOption((o) =>
            o.setName("mode")
              .setDescription("Player or Team")
              .setRequired(true)
              .addChoices(
                { name: "Player", value: "Player" },
                { name: "Team",   value: "Team"   },
              ),
          ),
      );

  public async execute(interaction: ChatInputCommandInteraction) {

    const subCommand = interaction.options.getSubcommand(true);
    const event = interaction.options.getString("event");

    let config: LeaderboardConfig;
    
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const subcommand = interaction.options.getSubcommand(true);
    const focused = interaction.options.getFocused();

    const eventTypeMap: Record<string, EventType> = {
      boss: EventType.Boss,
      race: EventType.Race,
      ct:   EventType.CT,
    };

    const eventType = eventTypeMap[subcommand];
    if (!eventType) {
      await interaction.respond([]);
      return;
    }

    const choices = await getEventAutocompleteChoices(eventType, focused);
    await interaction.respond(choices);
  }
}
