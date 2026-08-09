import { BossLeaderboard } from "./boss.mode";
import { CtLeaderboard } from "./ct.mode";
import { RaceLeaderboard } from "./race.mode";

export const LeaderboardModes = {
  boss: new BossLeaderboard(),
  race: new RaceLeaderboard(),
  ct: new CtLeaderboard()
}

export type leaderboardSubCommand = keyof typeof LeaderboardModes;