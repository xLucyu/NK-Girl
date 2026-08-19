import type { BaseBody } from "./types.event";
import { ScoringType } from "./types.gsc-lb";

export const BossDifficulties = ["Standard", "Elite"] as const; 
export type BossDifficulty = typeof BossDifficulties[number];

export interface BossBody extends BaseBody {
  metadataStandard: string;
  metadataElite: string;
  totalScores_standard: number;
  totalScores_elite: number;
  leaderboard_standard_players_1: string;
  leaderboard_elite_players_1: string;
  scoringType: string;
  normalScoringType: ScoringType;
  eliteScoringType: ScoringType;
  bossType: string;
}