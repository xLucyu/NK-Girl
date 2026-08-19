export interface Tower {
  tower: string;
  max: number;
  path1NumBlockedTiers?: number;
  path2NumBlockedTiers?: number;
  path3NumBlockedTiers?: number;
  isHero: boolean;
}

export interface MetaHealthMultipliers {
  bloons: number;
  moabs: number;
  boss: number;
}

export interface MetaBloonModifiers {
  speedMultiplier: number;
  moabSpeedMultiplier: number;
  bossSpeedMultiplier: number;
  regrowRateMultiplier: number;
  healthMultipliers: MetaHealthMultipliers;
  allCamo: boolean;
  allRegen: boolean;
}

export interface MetaBody {
  name: string;
  createdAt: number;
  id: string;
  creator?: string | null;
  gameVersion: string;
  map: string;
  mapURL: string;
  mode: string;
  difficulty: string;
  disableDoubleCash: boolean;
  disableInstas: boolean;
  disableMK: boolean;
  disablePowers: boolean;
  disableSelling: boolean;
  startingCash: number;
  abilityCooldownReductionMultiplier: number;
  leastCashUsed: number;
  leastTiersUsed: number;
  noContinues: boolean;
  seed: number;
  removeableCostMultiplier: number;
  roundSets: any[];
  lives: number;
  maxLives: number;
  startRound: number;
  endRound: number;
  maxTowers: number;
  maxParagons: number;
  plays: number;
  wins: number;
  restarts: number;
  losses: number;
  upvotes: number;
  playsUnique: number;
  winsUnique: number;
  lossesUnique: number;
  powers: any[];
  _bloonModifiers: MetaBloonModifiers;
  _towers?: Tower[] | null;
}

export interface MetaData {
  success: boolean;
  body: MetaBody;
}