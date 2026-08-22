import { ChatInputCommandInteraction } from "discord.js";
import { LeaderboardData } from "../base.leaderboard";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { BossDifficulty, EventType, GOOGLE_API_ULRS, LeaderboardPayload, splitBossNumbers } from "@btd6";
import { getData } from "@lib";


export class BossLeaderboard extends LeaderboardModeResolver {

  public readonly eventType = EventType.Boss;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {
    
    const event = this.resolveEventName(interaction);
    const difficulty = (interaction.options.getString("difficulty") as BossDifficulty | null) ?? "Standard";
    const teamSize = interaction.options.getInteger("team_size") ?? 1;

    const data = await this.fetchLeaderboard(event, difficulty, teamSize);
    const bossNumber = splitBossNumbers(data.name);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: `${bossNumber} ${difficulty} - ${teamSize}-player ${data.totalScores}-scores`
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
