import { CATEGORIES } from "@utils";
import type { Tower } from "../types";

type TowerCategories = Record<keyof typeof CATEGORIES, Array<Tower & { crossPaths: [number, number, number ]}>>

function getCrossPaths(tower: Tower): [number, number, number] {
    return [
        Math.max(0, 5 - (tower.path1NumBlockedTiers !== -1 ? tower.path1NumBlockedTiers : 5)),
        Math.max(0, 5 - (tower.path2NumBlockedTiers !== -1 ? tower.path2NumBlockedTiers : 5)),
        Math.max(0, 5 - (tower.path3NumBlockedTiers !== -1 ? tower.path3NumBlockedTiers : 5))
    ]
}

function getTowerCategory(towerName: string): keyof typeof CATEGORIES {
    return Object.entries(CATEGORIES).find(([_, towers]) => 
        towers.includes(towerName))?.[0] as keyof typeof CATEGORIES;
}

export function getTowers(towers: Tower[]): TowerCategories {

  const towerCategories = {
    Heroes: [],
    Primary: [],
    Military: [],
    Magic: [],
    Support: [],
  } as TowerCategories;

  for (const tower of towers) {

    if (tower.max === 0) continue;

    const category = getTowerCategory(tower.tower);

    towerCategories[category].push({
        ...tower,
        crossPaths: getCrossPaths(tower)
    });
  }

  return towerCategories;
}