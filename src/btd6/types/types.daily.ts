import { BaseBody } from "./types.event";

export type DailyChallengeType = "Standard" | "Advanced" | "Coop";

export interface DailyChallengeBody extends BaseBody {
  name: string;
  createdAt: number;
  id: string;
  creator: null;
  metadata: string;
}