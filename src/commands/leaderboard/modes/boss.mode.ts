import type { ChatInputCommandInteraction } from "discord.js";
import type { LeaderboardData } from "../base.leaderboard";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { type BossDifficulty, EventType, splitBossNumbers } from "@btd6";

export class BossLeaderboard extends LeaderboardModeResolver {
  
  public readonly eventType = EventType.Boss;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData | null> {

    const difficulty = (interaction.options.getString("difficulty") as BossDifficulty | null) ?? "Standard";
    const teamSize = interaction.options.getInteger("team_size") ?? 1;
    const data = await this.resolveLeaderboard(
      interaction,
      event => `Leaderboard/Boss/${event}/${difficulty}/${teamSize}/leaderboard.json`,
    );
    if (!data) return null;

    const bossNumber = splitBossNumbers(data.name);
    return {
      query: {
        type: this.eventType,
        eventName: data.name,
        subTitle: `${bossNumber} ${difficulty} - ${teamSize}-player ${data.totalScores}-scores`,
      },
      medalsMode: difficulty,
      data,
    };
  }
}
