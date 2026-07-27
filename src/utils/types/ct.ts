import { Tower } from "./metadata";

export interface Items {
  _items: Tower[];
}

export interface StartRules {
  lives: number;
  cash: number;
  round: number;
  endRound: number;
}

export interface DcHealthMultipliers {
  bloons: number;
  moabs: number;
}

export interface DcBloonModifiers {
  healthMultipliers: DcHealthMultipliers;
  speedMultiplier: number;
  moabSpeedMultiplier: number;
  regrowRateMultiplier: number;
}

export interface DcModel {
  startRules: StartRules;
  maxTowers: number;
  disableMK: boolean;
  disableSelling: boolean;
  bloonModifiers: DcBloonModifiers;
  towers: Items;
}

export interface BossData {
  bossBloon: number;
  TierCount: number;
}

export interface CTMetaData {
  selectedMap: string;
  selectedMode: string;
  subGameType: number;
  selectedDifficulty: string;
  dcModel: DcModel;
  bossData?: BossData;
}

export interface TileCode {
  EventNumber: number;
  Code: string;
  TileType: string;
  RelicType: string;
  GameData: CTMetaData;
}
