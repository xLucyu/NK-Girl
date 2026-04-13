export interface BaseBody {
  id: string;
  name: string;
  start: number;
  end: number;
}

export interface BossBody extends BaseBody {
  metadataStandard: string;
  metadataElite: string;
  totalScores_standard: number;
  totalScores_elite: number;
  leaderboard_standard_players_1: string;
  leaderboard_elite_players_1: string;
  scoringType: string;
  normalScoringType: string;
  eliteScoringType: string;
  bossType: string;
}

export interface RaceBody extends BaseBody {
  metadata: string;
  totalScores: number;
  leaderboard: string;
}

export interface CTBody extends BaseBody {
  totalScores_player: number;
  totalScores_team: number;
  leaderboard_player: string;
  leaderboard_team: string;
}

export interface OdysseyBody extends BaseBody {
  metadata_easy: string;
  metadata_medium: string;
  metadata_hard: string;
}

export interface NkData {
  success: boolean;
  body: BaseBody[];
}
