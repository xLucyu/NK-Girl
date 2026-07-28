import { getData } from "@api";
import { ChatInputCommandInteraction } from "discord.js";
import { addUnderscore, EventType, GOOGLE_API_ULRS, LeaderboardPayload } from "@utils";
import { BaseLeaderboard, LeaderboardConfig } from "../base.leaderboard";

export class BossLeaderboard extends BaseLeaderboard {

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const event = interaction.options.getString("event", true);
    const difficulty = interaction.options.getString("difficulty", true);
    const teamSize = interaction.options.getInteger("team_size", true);

    const config: LeaderboardConfig = {
      interaction,
      type: EventType.Boss,
      eventName: event,
      subtitle: `${difficulty} · ${teamSize}-player`,
      fetchLeaderboard: () => this.fetchLeaderboard(event, difficulty, teamSize),
      difficulty,
    };

    await this.createLeaderboard(config);
  }

  private async fetchLeaderboard(
    event: string,
    difficulty: string,
    teamSize: number,
  ): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.LeaderboardBoss
      .replace("{event}", addUnderscore(event))
      .replace("{difficulty}", difficulty)
      .replace("{teamSize}", String(teamSize));
    return getData(url);
  }
}
