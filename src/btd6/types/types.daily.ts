import { BaseBody } from "./types.event";
import { MetaBody } from "./types.metadata";

export const DailyChallengeDifficulties = ["Standard", "Advanced"] as const;
export type DailyChallengeDifficulty = typeof DailyChallengeDifficulties[number];

export interface DailyChallengeBody extends BaseBody {
  createdAt: number;
  creator: null;
  metadata: string;
}

export interface DailyChallenge {
  number: number;
  challenge: DailyChallengeBody;
}

export interface DailyChallengeSetBody extends BaseBody {
  Standard: DailyChallenge;
  Advanced: DailyChallenge;
}

export interface DailyChallengeSetMeta {
  Standard: MetaBody;
  Advanced: MetaBody;
}