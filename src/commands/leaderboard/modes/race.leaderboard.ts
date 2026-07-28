import { ChatInputCommandInteraction } from "discord.js";
import { addUnderscore, EventType, GOOGLE_API_ULRS, LeaderboardPayload } from "@utils";
import { BaseLeaderboard, LeaderboardConfig } from "../base.leaderboard";
import { getData } from "@api";

export class RaceLeaderboard extends BaseLeaderboard {

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const event = interaction.options.getString("event", true);

    const config: LeaderboardConfig = {
      interaction,
      type: EventType.Race,
      eventName: event,
      fetchLeaderboard: () => this.fetchLeaderboard(event),
      difficulty: "",
    };

    await this.createLeaderboard(config);
  }

  private async fetchLeaderboard(event: string): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.LeaderboardRace
      .replace("{event}", addUnderscore(event));
    return getData(url);
  }
}
