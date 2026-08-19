import type { BaseBody } from "./types.event";

export interface RaceBody extends BaseBody {
  metadata: string;
  totalScores: number;
  leaderboard: string;
}