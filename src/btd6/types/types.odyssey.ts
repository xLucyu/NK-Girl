import type { BaseBody } from "./types.event";
import type { MetaBody, Tower } from "./types.metadata";

export const OdysseyDifficulties = ["Easy", "Medium", "Hard"] as const;
export type OdysseyDifficulty = typeof OdysseyDifficulties[number];

export interface OdysseyBody extends BaseBody {
  metadata_easy: string;
  metadata_medium: string;
  metadata_hard: string;
}

export interface MapsData {
  success: boolean;
  body: MetaBody[];
}

export interface OdysseyMetaData {
  id: string;
  isExtreme: boolean;
  maxMonkeySeats: number;
  maxMonkeysOnBoat: number;
  maxPowerSlots: number;
  startingHealth: number;
  _rewards: any[];
  _availablePowers: any[];
  _availableTowers: Tower[];
  maps: string;
}

export interface Odyssey {
  success: boolean;
  body: OdysseyMetaData;
}