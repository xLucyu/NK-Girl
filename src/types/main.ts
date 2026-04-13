export interface NkBody {
  id: string;
  name: string;
  start: number;
  end: number;
  metadata?: string;
  totalScores?: number;
  leaderboard?: string;
  bossType?: string;
  metadataStandard?: string;
  metadataElite?: string;
  totalScores_standard?: number;
  totalScores_elite?: number;
  leaderboard_standard_players_1?: string;
  leaderboard_elite_players_1?: string;
  scoringType?: string;
  normalScoringType?: string;
  eliteScoringType?: string;
  totalScores_player?: number;
  totalScores_team?: number;
  leaderboard_player?: string;
  leaderboard_team?: string;
  metadata_easy?: string;
  metadata_medium?: string;
  metadata_hard?: string;
  createdAt?: number;
}

export interface NkData {
  success: boolean;
  body: NkBody[];
}
