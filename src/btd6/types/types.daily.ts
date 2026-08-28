import { BaseBody } from "./types.event";
import { MetaBody } from "./types.metadata";

export type DailyChallengeType = "Standard" | "Advanced";

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