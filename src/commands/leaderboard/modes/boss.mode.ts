import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardData } from "../base.leaderboard";
import { getData } from "@api";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload,
  BossDifficulty,
  BossDifficulties, 
} from "@utils";

export class BossLeaderboard extends BaseLeaderboard {

  public readonly eventType = EventType.Boss;

  protected async resolveLeaderboard(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {
    
    const event = this.resolveEventName(interaction);
    const difficulty = interaction.options.getString("difficulty") as BossDifficulty ?? BossDifficulties[0];
    const teamSize = interaction.options.getInteger("team_size") ?? 1;

    const data = await this.fetchLeaderboard(event, difficulty, teamSize);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: `${difficulty} - ${teamSize}-player`
      },
      medalsMode: difficulty,
      data: data
    }
  }

  private async fetchLeaderboard(
    event: string,
    difficulty: string,
    teamSize: number,
  ): Promise<LeaderboardPayload> {
    const url = GOOGLE_API_ULRS.BossLeaderboard
      .replace("{event}", addUnderscore(event))
      .replace("{difficulty}", difficulty)
      .replace("{teamSize}", String(teamSize));
    return getData<LeaderboardPayload>(url);
  }
}
