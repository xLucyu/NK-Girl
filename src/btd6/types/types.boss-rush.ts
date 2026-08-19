export interface BossRushStage {
  stage: number;
  map: string;
  boss: string;
  towers: string[];
  removed: string[];
  relics: string[];
  newRelic: string | null;
}

export interface BossRushResult {
  seed: string;
  numericSeed: number;
  hero: string | null;
  availableTowers: string[];
  stages: BossRushStage[];
}