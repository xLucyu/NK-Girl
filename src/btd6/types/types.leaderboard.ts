export interface LeaderboardScorePart {
  type: string;
  score: number;
  name: string;
}

export interface LeaderboardBody {
  displayName: string;
  score: number;
  scoreParts: LeaderboardScorePart[];
  submissionTime: number;
  profile: string;
}

export interface Leaderboard {
  success: boolean;
  body: LeaderboardBody[];
  next?: string | null;
  prev?: string | null;
}