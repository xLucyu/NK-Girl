import { CATEGORIES } from "@btd6/constants";
import { Tower } from "@btd6/types";


export type TowerEntry = {
  name: string;
  max: number;
  crossPaths: [number, number, number];
};

export type TowerCategories = Record<keyof typeof CATEGORIES, TowerEntry[]>;

function getCrossPaths(tower: Tower): [number, number, number] { 
  
  const getTier = (blockedTiers: number | undefined): number => {
    if (blockedTiers === undefined || blockedTiers === -1) return 5; // ct doesnt have crossPaths
    return Math.max(0, 5 - blockedTiers);
  }

  return [
    getTier(tower.path1NumBlockedTiers),
    getTier(tower.path2NumBlockedTiers),
    getTier(tower.path3NumBlockedTiers)
  ]
}

export function getTowers(towers: Tower[]): TowerCategories {
  
  const incoming = new Map<string, Tower>();
  for (const tower of towers) {
    if (tower.max === 0) continue;
    incoming.set(tower.tower, tower);
  }

  const availableTowers = {
    Heroes: [],
    Primary: [],
    Military: [],
    Magic: [],
    Support: [],
  } as TowerCategories;

  for (const [category, canonicalOrder] of Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, string[]][]) {

    for (const towerName of canonicalOrder) {

      const tower = incoming.get(towerName);
      if (!tower) continue;

      availableTowers[category].push({
        name: tower.tower,
        max: tower.max,
        crossPaths: getCrossPaths(tower),
      });
    }
  }
  return availableTowers;
}

/** Towers absent from the allowed list (or explicitly capped at zero). */
export function getDisabledTowers(towers: Tower[]): TowerCategories {
  const available = new Set(
    towers.filter((tower) => tower.max !== 0).map((tower) => tower.tower)
  );
  const anyHeroAllowed = available.has("ChosenPrimaryHero");

  const disabled = {
    Heroes: [],
    Primary: [],
    Military: [],
    Magic: [],
    Support: [],
  } as TowerCategories;

  for (const [category, canonicalOrder] of Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, string[]][]) {
    for (const towerName of canonicalOrder) {
      // ChosenPrimaryHero is a wildcard, not a separate playable hero.
      if (towerName === "ChosenPrimaryHero") continue;
      if (category === "Heroes" && anyHeroAllowed) continue;
      if (available.has(towerName)) continue;

      disabled[category].push({
        name: towerName,
        max: -1,
        crossPaths: [5, 5, 5],
      });
    }
  }

  return disabled;
}
