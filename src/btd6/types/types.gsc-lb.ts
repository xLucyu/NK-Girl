export enum ScoringType {
  GameTime = "GameTime",
  LeastCash = "LeastCash",
  LeastTiers = "LeastTiers",
  CTPoints = "CTPoints"
}

export interface ScoreParts {
  score: number;
  secondScore?: number | null;
  thirdScore?: number | null;
}

export interface Member {
  displayName: string;
  profile: string;
}

export interface Team {
  position: number;
  members: Member[];
  scoreParts: ScoreParts;
}

export interface LeaderboardPayload {
  id: string;
  start: number;
  end: number;
  eventType: "Boss" | "Race" | "CT";
  name: string;
  totalScores: number;
  scoringType: string;
  teams: Team[];
}


export interface ScoreParts {
  score: number;
  secondScore?: number | null;
  thirdScore?: number | null;
}

export interface Member {
  displayName: string;
  profile: string;
}

export interface Team {
  position: number;
  members: Member[];
  scoreParts: ScoreParts;
}

export interface LeaderboardPayload {
  id: string;
  start: number;
  end: number;
  eventType: "Boss" | "Race" | "CT";
  name: string;
  totalScores: number;
  scoringType: ScoringType | string;
  teams: Team[];
}