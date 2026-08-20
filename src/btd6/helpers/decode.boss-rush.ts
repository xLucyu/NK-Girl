import { 
  BOSS_RUSH_SETTINGS, 
  DEFAULT_TOWERS, 
  MAPS, 
  RawMap 
} from "@btd6/constants";


type DifficultyName = "Beginner" | "Intermediate" | "Advanced" | "Expert";
type Difficulty = 0 | 1 | 2 | 3;

interface TowerSetting {
  chance?: number;         Chance?: number;
  canPopLead?: boolean;    CanPopLead?: boolean;
  canPopCamo?: boolean;    CanPopCamo?: boolean;
  isCheapTower?: boolean;  IsCheapTower?: boolean;
  
}

interface BossSpecialEntry {
  Primary?: string[] | null;
  Military?: string[] | null;
  Magic?: string[] | null;
  Support?: string[] | null;
  AllTowers?: string[] | null;
}

interface GameMap {
  mapId: string;
  difficulty: Difficulty;
  hasWater: boolean;
  isStandard: boolean;
}

interface StageResult {
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
  stages: StageResult[];
}

const MBIG = 2147483647;
const MSEED = 161803398;
const INT_MIN = -2147483648;

class SystemRandom {
  private seedArray = new Array<number>(56).fill(0);
  private inext = 0;
  private inextp = 21;

  constructor(seed: number) {
    const subtraction = seed === INT_MIN ? MBIG : Math.abs(seed);
    let mj = MSEED - subtraction;
    if (mj < 0) mj += MBIG;
    this.seedArray[55] = mj;

    let mk = 1;
    for (let i = 1; i < 55; i++) {
      const ii = (21 * i) % 55;
      this.seedArray[ii] = mk;
      mk = mj - mk;
      if (mk < 0) mk += MBIG;
      mj = this.seedArray[ii];
    }
    for (let k = 0; k < 4; k++) {
      for (let i = 1; i < 56; i++) {
        this.seedArray[i] -= this.seedArray[1 + ((i + 30) % 55)];
        if (this.seedArray[i] < 0) this.seedArray[i] += MBIG;
      }
    }
  }

  private internalSample(): number {
    let locINext = this.inext + 1;
    if (locINext >= 56) locINext = 1;
    let locINextp = this.inextp + 1;
    if (locINextp >= 56) locINextp = 1;

    let retVal = this.seedArray[locINext] - this.seedArray[locINextp];
    if (retVal === MBIG) retVal -= 1;
    if (retVal < 0) retVal += MBIG;

    this.seedArray[locINext] = retVal;
    this.inext = locINext;
    this.inextp = locINextp;
    return retVal;
  }

  sample(): number { return this.internalSample() * (1.0 / MBIG); }
  nextDouble(): number { return this.sample(); }

  next(maxValue: number): number;
  next(minValue: number, maxValue: number): number;
  next(a: number, b?: number): number {
    const min = b === undefined ? 0 : a;
    const max = b === undefined ? a : b;
    return Math.trunc(this.sample() * (max - min)) + min;
  }
}

function seedFromId(id: string): number {
  if (!id || !id.trim()) return 0;
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const lower = id.toLowerCase();
  let result = 0n;
  for (let pos = 0; pos < lower.length; pos++) {
    const digit = chars.indexOf(lower[lower.length - 1 - pos]);
    if (digit >= 0) result += BigInt(digit) * 36n ** BigInt(pos);
  }
  while (result > 2147483647n) result /= 10n;
  return Number(result);
}

function reservoirPick<T>(rng: SystemRandom, values: readonly T[], fallback: T | null = null): T | null {
  let result: T | null = fallback;
  let n = 0;
  for (const v of values) {
    n++;
    if (rng.next(n) === 0) result = v;
  }
  return result;
}

function weightedIndex(rng: SystemRandom, weights: readonly number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const roll = rng.nextDouble() * total;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (roll <= cumulative) return i;
  }
  throw new Error("weightedIndex: no index selected");
}

function weightedItem<T>(rng: SystemRandom, items: readonly T[], getWeight: (item: T) => number): T | null {
  if (items.length === 0) return null;
  const weighted = items.map((i) => [i, getWeight(i)] as const);
  const total = weighted.reduce((a, [, w]) => a + w, 0);
  if (total <= 0) return null;
  const roll = rng.nextDouble() * total;
  let cumulative = 0;
  let fallback: T | null = null;
  for (const [item, weight] of weighted) {
    fallback = item;
    cumulative += weight;
    if (roll <= cumulative) return item;
  }
  return fallback;
}

function weightedFromMap<T>(rng: SystemRandom, map: ReadonlyMap<T, number>): T | null {
  let total = 0;
  for (const w of map.values()) total += w;
  const roll = rng.nextDouble() * total;
  let cumulative = 0;
  let fallback: T | null = null;
  for (const [item, weight] of map) {
    fallback = item;
    cumulative += weight;
    if (roll <= cumulative) return item;
  }
  return fallback;
}

  const DIFFICULTY_BY_NAME: Record<string, Difficulty> = {
    Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3,
  };
  const DIFFICULTY_NAMES: Record<Difficulty, DifficultyName> = {
    0: "Beginner", 1: "Intermediate", 2: "Advanced", 3: "Expert",
  };

  const WATER_MAPS = new Set(["Peninsula", "SpiceIslands"]);
  const WATER_TOWERS = new Set(["MonkeySub", "MonkeyBuccaneer"]);
  const CHOSEN_PRIMARY_HERO = "ChosenPrimaryHero";

  const HERO_IDS: string[] = DEFAULT_TOWERS
    .filter(tower => tower.category === "Heroes" && tower.id !== CHOSEN_PRIMARY_HERO)
    .map(tower => tower.id);

  const TOWER_IDS: string[] = DEFAULT_TOWERS
    .filter(tower => tower.category !== "Heroes")
    .map(tower => tower.id);
    
  const TOWER_DISPLAY_INDEX = new Map(TOWER_IDS.map((t, i) => [t, i]));
  const byDisplayOrder = (a: string, b: string) => (TOWER_DISPLAY_INDEX.get(a) ?? 99) - (TOWER_DISPLAY_INDEX.get(b) ?? 99);

const BOSS_BY_KEY: Record<string, string> = {
  bloonarius: "Bloonarius", 
  dreadbloon: "Dreadbloon", 
  phayze: "Phayze",
  blastapopoulos: "Blastapopoulos", 
  lych: "Lych", 
  diamondback: "Diamondback",
};

const rs = BOSS_RUSH_SETTINGS.RandomSettings as any;

const SETTINGS = {
  stageScores: BOSS_RUSH_SETTINGS.StageScores as number[],
  randomSettings: {
    mapDifficultyChances: rs.MapDifficultyChances as Array<Partial<Record<DifficultyName, number>>>,
    finalStageTowerCount: rs.FinalStageTowerCount as number,
    stageTowerIncrement: rs.StageTowerIncrement as number,
    availableBosses: rs.AvailableBosses as string[],
    bannedMaps: (rs.BannedMaps ?? []) as string[],
    bannedRelics: (rs.BannedRelics ?? []) as string[],
    bannedHeroes: (rs.BannedHeroes ?? []) as string[],
    bannedTowers: (rs.BannedTowers ?? []) as string[],
    relicChances: rs.RelicChances as Record<string, number>,
    heroChances: rs.HeroChances as Record<string, number>,
    towerSettings: rs.TowerSettings as Record<string, TowerSetting>,
    bossSpecialTowers: rs.BossSpecialTowers as Record<string, BossSpecialEntry[]>,
  },
  overrides: {
    stageMaps: ((BOSS_RUSH_SETTINGS as any).Overrides?.StageMap ?? []) as string[],
    stageBosses: ((BOSS_RUSH_SETTINGS as any).Overrides?.StageBoss ?? []) as string[],
    stageRelics: ((BOSS_RUSH_SETTINGS as any).Overrides?.StageRelics ?? []) as string[][],
    hero: ((BOSS_RUSH_SETTINGS as any).Overrides?.Hero ?? null) as string | null,
    baseTowerSet: ((BOSS_RUSH_SETTINGS as any).Overrides?.BaseTowerSet ?? null) as string[] | null,
  },
};

const GAME_MAPS: GameMap[] = (MAPS as RawMap[])
  .filter((m) => m.category in DIFFICULTY_BY_NAME)
  .map((m) => ({
    mapId: m.id,
    difficulty: DIFFICULTY_BY_NAME[m.category],
    hasWater: !!m.hasWater,
    isStandard: !!m.isStandard,
  }));

const towerFlag = (s: TowerSetting | undefined, ...keys: (keyof TowerSetting)[]) =>
  keys.some((k) => !!s?.[k]);
const towerChance = (ts: Record<string, TowerSetting>, id: string) =>
  Number(ts[id]?.chance ?? ts[id]?.Chance ?? 0);

function rollDifficulty(rng: SystemRandom, stage: number, invalid: ReadonlySet<Difficulty>): Difficulty {
  const chances = SETTINGS.randomSettings.mapDifficultyChances;
  const row = stage < chances.length ? chances[stage] : chances[chances.length - 1];
  const weights = ([0, 1, 2, 3] as Difficulty[]).map((d) =>
    invalid.has(d) ? 0 : Number(row[DIFFICULTY_NAMES[d]] ?? 0),
  );
  return weightedIndex(rng, weights) as Difficulty;
}

function generateMaps(rng: SystemRandom, count: number): GameMap[] {
  const banned = new Set(SETTINGS.randomSettings.bannedMaps);
  const selected: GameMap[] = [];

  while (selected.length < count) {
    let candidates: GameMap[] = [];
    let previous: Difficulty | null = null;
    const invalid = new Set<Difficulty>();

    for (let attempt = 0; attempt < 100 && candidates.length === 0; attempt++) {
      if (previous !== null) invalid.add(previous);
      const difficulty = rollDifficulty(rng, selected.length, invalid);
      previous = difficulty;
      candidates = GAME_MAPS.filter(
        (m) =>
          m.isStandard &&
          m.difficulty === difficulty &&
          !banned.has(m.mapId) &&
          !selected.includes(m),
      );
    }
    if (candidates.length === 0) throw new Error("generateMaps: no candidate map found");
    selected.push(candidates[rng.next(candidates.length)]);
  }
  return selected;
}

function generateBosses(rng: SystemRandom, count: number): string[] {
  const available = SETTINGS.randomSettings.availableBosses
    .map((b) => BOSS_BY_KEY[b.toLowerCase()])
    .filter(Boolean);

  const generated: string[] = [];
  let pool = [...available];

  while (generated.length < count) {
    if (pool.length === 0) {
      pool = [...available];
      const lastIndex = pool.indexOf(generated[generated.length - 1]);
      if (lastIndex !== -1) pool.splice(lastIndex, 1);
    }
    const selected = reservoirPick(rng, pool);
    if (selected === null) throw new Error("generateBosses: empty pool");
    pool.splice(pool.indexOf(selected), 1);
    generated.push(selected);
  }
  return generated;
}

type CategoryLists = [string[], string[], string[], string[], string[]];

function readCategoryLists(entry: BossSpecialEntry): CategoryLists {
  const read = (k: keyof BossSpecialEntry) => (entry[k] ?? []).map(String);
  return [read("Primary"), read("Military"), read("Magic"), read("Support"), read("AllTowers")];
}

function getBossSpecialTowers(
  rng: SystemRandom,
  boss: string,
  chances: ReadonlyMap<string, number>,
): string[] {
  const raw = SETTINGS.randomSettings.bossSpecialTowers[boss] ?? [];
  if (raw.length === 0) return [];

  const entries = raw.map(readCategoryLists);
  const validIds = new Set(chances.keys());
  const result: string[] = [];
  let usedPrimary = false, usedMilitary = false, usedMagic = false, usedSupport = false;

  for (const current of entries) {
    const overlaps = result.some(
      (s) => current[0].includes(s) || current[1].includes(s) ||
             current[2].includes(s) || current[3].includes(s),
    );
    const lists = overlaps ? entries[0] : current;

    const pool: string[] = [];
    if (!usedPrimary) pool.push(...lists[0]);
    if (!usedMilitary) pool.push(...lists[1]);
    if (!usedMagic) pool.push(...lists[2]);
    if (!usedSupport) pool.push(...lists[3]);
    pool.push(...lists[4]);

    const chosenSoFar = new Set(result);
    // NOTE: `validIds` silently drops any id absent from TowerSettings
    // (e.g. "Buccaneer" vs "MonkeyBuccaneer" in the shipped data).
    const candidates = pool.filter((id) => !chosenSoFar.has(id) && validIds.has(id));

    const selected = weightedItem(rng, candidates, (id) => chances.get(id) ?? 0);
    if (selected === null) continue;

    result.push(selected);
    usedPrimary = lists[0].includes(selected);
    usedMilitary = lists[1].includes(selected);
    usedMagic = lists[2].includes(selected);
    usedSupport = lists[3].includes(selected);
  }
  return result;
}

function isValidTowerSet(
  towers: readonly string[],
  ts: Record<string, TowerSetting>,
  mapId: string,
): boolean {
  if (towers.length < 3) return false;
  const hasLead = towers.some((i) => towerFlag(ts[i], "canPopLead", "CanPopLead"));
  const hasCamo = towers.some((i) => towerFlag(ts[i], "canPopCamo", "CanPopCamo"));
  const cheapCount = towers.filter((i) => towerFlag(ts[i], "isCheapTower", "IsCheapTower")).length;
  if (!hasLead || !hasCamo || cheapCount <= 1) return false;
  if (WATER_MAPS.has(mapId)) return towers.some((i) => WATER_TOWERS.has(i));
  return true;
}


function pickHero(rng: SystemRandom): string | null {
  const override = SETTINGS.overrides.hero;
  if (override) {
    return override === CHOSEN_PRIMARY_HERO
      ? CHOSEN_PRIMARY_HERO
      : HERO_IDS.includes(override) ? override : null;
  }
  const banned = new Set(SETTINGS.randomSettings.bannedHeroes);
  const candidates: string[] = [];
  if (!banned.has(CHOSEN_PRIMARY_HERO)) candidates.push(CHOSEN_PRIMARY_HERO);
  candidates.push(...HERO_IDS.filter((h) => !banned.has(h)));
  return weightedItem(rng, candidates, (h) => SETTINGS.randomSettings.heroChances[h] ?? 0);
}

function generateStageTowers(
  rng: SystemRandom,
  boss: string,
  map: GameMap,
  nextStageTowers: readonly string[] | null,
): string[] {
  const R = SETTINGS.randomSettings;
  const ts = R.towerSettings;
  const chances = new Map(Object.keys(ts).map((id) => [id, towerChance(ts, id)] as const));
  const bossTowers = getBossSpecialTowers(rng, boss, chances);
  const banned = new Set(R.bannedTowers);
  const available = TOWER_IDS.filter((id) => !banned.has(id) && (chances.get(id) ?? 0) > 0);
  const proposed: string[] = [];

  if (nextStageTowers !== null) {
    proposed.push(...nextStageTowers);
    const target = nextStageTowers.length + R.stageTowerIncrement;

    const bossCandidates = TOWER_IDS.filter(
      (id) => bossTowers.includes(id) && !proposed.includes(id) && (chances.get(id) ?? 0) > 0,
    );
    if (bossCandidates.length > 0) {
      const selected = weightedItem(rng, bossCandidates, (id) => chances.get(id) ?? 0);
      if (selected !== null) proposed.push(selected);
    }
    while (proposed.length < target) {
      const candidates = available.filter((id) => !proposed.includes(id));
      const selected = weightedItem(rng, candidates, (id) => chances.get(id) ?? 0);
      if (selected === null) break;
      proposed.push(selected);
    }
    return proposed;
  }

  const availableSet = new Set(available);
  proposed.push(
    ...(SETTINGS.overrides.baseTowerSet ?? []).map(String).filter((id) => id && availableSet.has(id)),
  );
  if (proposed.length === 0) proposed.push(...TOWER_IDS.filter((id) => bossTowers.includes(id)));

  if (proposed.length === 0) {
    const leadCandidates = available.filter((id) => towerFlag(ts[id], "canPopLead", "CanPopLead"));
    const camoCandidates = available.filter((id) => towerFlag(ts[id], "canPopCamo", "CanPopCamo"));

    const lead = weightedItem(rng, leadCandidates, (id) => chances.get(id) ?? 0);
    if (lead !== null) proposed.push(lead);
    if (lead === null || !camoCandidates.includes(lead)) {
      const camo = weightedItem(rng, camoCandidates, (id) => chances.get(id) ?? 0);
      if (camo !== null && !proposed.includes(camo)) proposed.push(camo);
    }
  }

  if (WATER_MAPS.has(map.mapId) && !proposed.some((i) => WATER_TOWERS.has(i))) {
    const waterCandidates = available.filter((id) => WATER_TOWERS.has(id));
    const water = weightedItem(rng, waterCandidates, (id) => chances.get(id) ?? 0);
    if (water !== null) proposed.push(water);
  }

  while (proposed.length < R.finalStageTowerCount) {
    const candidates = available.filter((id) => !proposed.includes(id));
    const selected = weightedItem(rng, candidates, (id) => chances.get(id) ?? 0);
    if (selected === null) break;
    proposed.push(selected);
  }

  const hero = pickHero(rng);
  if (hero !== null) proposed.unshift(hero);
  return proposed;
}

function generateTowers(
  rng: SystemRandom,
  stageCount: number,
  maps: readonly GameMap[],
  bosses: readonly string[],
): string[][] {
  const lastMap = maps[stageCount - 1];
  const lastBoss = bosses[stageCount - 1];

  let final: string[] | null = null;
  for (let attempt = 0; attempt < 100; attempt++) {
    const candidate = generateStageTowers(rng, lastBoss, lastMap, null);
    if (isValidTowerSet(candidate, SETTINGS.randomSettings.towerSettings, lastMap.mapId)) {
      final = candidate;
      break;
    }
  }
  if (!final) throw new Error("generateTowers: no valid final tower set after 100 attempts");

  const generated: string[][] = [final];
  for (let i = stageCount - 2; i >= 0; i--) {
    generated.unshift(generateStageTowers(rng, bosses[i], maps[i], generated[0]));
  }
  return generated;
}

function generateRelics(rng: SystemRandom, stageCount: number, relicOrder: readonly string[]): string[][] {
  const banned = new Set(SETTINGS.randomSettings.bannedRelics);
  const available = new Map(
    relicOrder
      .filter((r) => !banned.has(r))
      .map((r) => [r, Number(SETTINGS.randomSettings.relicChances[r] ?? 0)] as const),
  );

  const generated: string[][] = [];
  while (generated.length < stageCount) {
    const stageRelics = generated.length > 0 ? [...generated[generated.length - 1]] : [];
    let total = 0;
    for (const w of available.values()) total += w;
    if (total > 0) {
      const selected = weightedFromMap(rng, available);
      if (selected !== null) {
        available.delete(selected);
        stageRelics.push(selected);
      }
    }
    generated.push(stageRelics);
  }
  return generated;
}

export function generateBossRush(seed: string): BossRushResult {

  const numericSeed = seedFromId(seed);
  const stageCount = SETTINGS.stageScores.length;
  const rng = new SystemRandom(numericSeed);

  const maps = generateMaps(rng, stageCount);
  const bosses = generateBosses(rng, stageCount);
  const towers = generateTowers(rng, stageCount, maps, bosses);
  const relics = generateRelics(
    rng,
    stageCount,
    Object.keys(SETTINGS.randomSettings.relicChances),
  );

  const isHero = (id: string) => id === CHOSEN_PRIMARY_HERO || HERO_IDS.includes(id);
  const hero = towers[0].length > 0 && isHero(towers[0][0]) ? towers[0][0] : null;
  const towersOnly = towers.map((s) => (hero !== null ? s.slice(1) : [...s]).sort(byDisplayOrder));

  const stages: StageResult[] = towersOnly.map((set, i) => {
    const previous = i > 0 ? new Set(towersOnly[i - 1]) : null;
    const current = new Set(set);
    return {
      stage: i + 1,
      map: maps[i].mapId,
      boss: bosses[i],
      towers: set,
      removed: previous ? [...previous].filter((x) => !current.has(x)).sort(byDisplayOrder) : [],
      relics: relics[i],
      newRelic:
        i === 0
          ? relics[0][relics[0].length - 1] ?? null
          : relics[i].length > relics[i - 1].length
            ? relics[i][relics[i].length - 1]
            : null,
    };
  });

  return {
    seed,
    numericSeed,
    hero,
    availableTowers: towersOnly[0],
    stages,
  };
}