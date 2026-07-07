import { CATEGORIES } from "@utils";
import type { Tower } from "../types";

export type TowerEntry = {
  name: string;
  max: number;
  crossPaths: [number, number, number];
};

export type TowerCategories = Record<keyof typeof CATEGORIES, TowerEntry[]>;

function getCrossPaths(tower: Tower): [number, number, number] {
  return [
    Math.max(0, 5 - (tower.path1NumBlockedTiers !== -1 ? tower.path1NumBlockedTiers : 5)),
    Math.max(0, 5 - (tower.path2NumBlockedTiers !== -1 ? tower.path2NumBlockedTiers : 5)),
    Math.max(0, 5 - (tower.path3NumBlockedTiers !== -1 ? tower.path3NumBlockedTiers : 5)),
  ];
}

export function getTowers(towers: Tower[]): TowerCategories {
  const incoming = new Map<string, Tower>();
  for (const tower of towers) {
    if (tower.max === 0) continue;
    incoming.set(tower.tower, tower);
  }

  const result = {
    Heroes: [],
    Primary: [],
    Military: [],
    Magic: [],
    Support: [],
  } as TowerCategories;

  for (const [category, canonicalOrder] of Object.entries(CATEGORIES) as [
    keyof typeof CATEGORIES,
    string[]
  ][]) {
    for (const towerName of canonicalOrder) {
      const tower = incoming.get(towerName);
      if (!tower) continue;

      result[category].push({
        name: tower.tower,
        max: tower.max,
        crossPaths: getCrossPaths(tower),
      });
    }
  }
  return result;
}
