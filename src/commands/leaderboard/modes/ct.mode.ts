import { ChatInputCommandInteraction } from "discord.js";
import { addUnderscore, EventType, GOOGLE_API_ULRS, LeaderboardPayload } from "@utils";
import { BaseLeaderboard, LeaderboardConfig } from "../base.leaderboard";
import { getData } from "@api";

export class CtLeaderboard extends BaseLeaderboard {

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const event = interaction.options.getString("event", true);
    const mode = interaction.options.getString("mode", true);

    const config: LeaderboardConfig = {
      interaction,
      type: EventType.CT,
      eventName: event,
      subtitle: mode,
      fetchLeaderboard: () => this.fetchLeaderboard(event, mode),
      difficulty: mode,
    };

    await this.createLeaderboard(config);
  }

  private async fetchLeaderboard(
    event: string,
    mode: string,
  ): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.LeaderboardCT
      .replace("{event}", addUnderscore(event))
      .replace("{mode}", mode);
    return getData(url);
  }
}
