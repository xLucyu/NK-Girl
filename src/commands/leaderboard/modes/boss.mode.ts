import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardConfigInput } from "../base.leaderboard";
import { getData } from "@api";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload, 
} from "@utils";

export class BossLeaderboard extends BaseLeaderboard {

  protected buildConfig(interaction: ChatInputCommandInteraction): LeaderboardConfigInput {

    const event = interaction.options.getString("event", true);
    const difficulty = interaction.options.getString("difficulty", true);
    const teamSize = interaction.options.getInteger("team_size", true);

    return {
      type: EventType.Boss,
      eventName: event,
      subtitle: `${difficulty} · ${teamSize}-player`,
      fetchLeaderboard: () => this.fetchLeaderboard(event, difficulty, teamSize),
      difficulty,
    };
  }

  private async fetchLeaderboard(
    event: string,
    difficulty: string,
    teamSize: number,
  ): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.BossLeaderboard
      .replace("{event}", addUnderscore(event))
      .replace("{difficulty}", difficulty)
      .replace("{teamSize}", String(teamSize));
    return getData<LeaderboardPayload>(url);
  }
}
