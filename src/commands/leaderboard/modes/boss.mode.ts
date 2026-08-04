import { ChatInputCommandInteraction } from "discord.js";
import { LeaderboardData } from "../base.leaderboard";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { getData } from "@api";
import { 
  EventType, 
  GOOGLE_API_ULRS, 
  type BossDifficulty, 
  type LeaderboardPayload 
} from "@utils";

export class BossLeaderboard extends LeaderboardModeResolver {

  public readonly eventType = EventType.Boss;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData | null> {
    
    const event = this.resolveEventName(interaction);
    const difficulty = (interaction.options.getString("difficulty") as BossDifficulty | null) ?? "Standard";
    const teamSize = interaction.options.getInteger("team_size") ?? 1;

    const data = await this.fetchLeaderboard(event, difficulty, teamSize);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: `${difficulty} - ${teamSize}-player ${data.totalScores}-scores`
      },
      medalsMode: difficulty,
      data: data
    }
  }

  private async fetchLeaderboard(
    event: string,
    difficulty: BossDifficulty,
    teamSize: number,
  ): Promise<LeaderboardPayload> {

    const url = GOOGLE_API_ULRS.BossLeaderboard
      .replace("{event}", event)
      .replace("{difficulty}", difficulty)
      .replace("{teamSize}", String(teamSize));

    return getData<LeaderboardPayload>(url);
  }
}
