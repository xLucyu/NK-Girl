export interface BossScoreParts {
  bossTier: number;
  score: number;
  secondScore?: number | null;
}

export interface Member {
  displayName: string;
  profile: string;
}

export interface BossTeam {
  position: number;
  members: Member[];
  scoreParts: BossScoreParts;
}

export interface BossLB {
  id: string;
  boss: string;
  totalScores: number;
  scoringType: string;
  teams: BossTeam[];
}
