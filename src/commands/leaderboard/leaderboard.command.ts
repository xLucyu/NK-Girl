import {
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  ModalBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { InteractionType } from "../base.command";
import { centerOn, type ComponentState } from "@components";
import { getEventAutocompleteChoices } from "../auto.complete";
import {
  BaseLeaderboard,
  type LeaderboardOptions,
} from "./base.leaderboard";
import { BossLeaderboard, CtLeaderboard, RaceLeaderboard } from "./modes";
import { BossDifficulties, EventType, LeaderboardPayload, playerMultiplier } from "@utils";

export class LeaderboardCommand {

  private readonly modes = {
    boss: new BossLeaderboard(),
    race: new RaceLeaderboard(),
    ct: new CtLeaderboard(),
  };

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
    if (!mode) return;

    await mode.execute(interaction);
  }

  public async autoComplete(interaction: AutocompleteInteraction): Promise<void> {

    const mode = this.modeFromSubcommand(interaction.options.getSubcommand(true));
    if (!mode) return interaction.respond([]);

    await interaction.respond(
      await getEventAutocompleteChoices(mode.eventType, interaction.options.getFocused(), "Leaderboard"),
    );
  }

  public async renderAndReply(
    interaction: InteractionType,
    state: ComponentState,
  ): Promise<void> {
    await this.modeFromState(state).renderAndReply(interaction, state);
  }

public handleModal(state: ComponentState, key: string, input: string): boolean {

  if (key !== "search") return false;

  const options = state.options as LeaderboardOptions;
  const index = this.findIndex(options.data, input);

  if (index === null) return false;

  centerOn(state, index);
  return true;
}


  private findIndex(data: LeaderboardPayload, input: string): number | null {

    const needle = input.trim();
    if (!needle) return null;

    const asNumber = Number(needle);

    const index = Number.isInteger(asNumber) && asNumber > 0
      ? data.teams.findIndex((team) => team.position === asNumber)
      : data.teams.findIndex((team) =>
          team.members.some((member) =>
            member.displayName.toLowerCase().includes(needle.toLowerCase()),
          ),
        );

  return index === -1 ? null : index;
}


  public buildModal(key: string): ModalBuilder | null {
    return BaseLeaderboard.buildModal(key);
  }

  private modeFromSubcommand(name: string): BaseLeaderboard | undefined {
    return this.modes[name as keyof typeof this.modes];
  }

  private modeFromState(state: ComponentState): BaseLeaderboard {

    const { query } = state.options as LeaderboardOptions;

    return query.type === EventType.Boss ? this.modes.boss
         : query.type === EventType.Race ? this.modes.race
         :                                 this.modes.ct;
  }
}
