import { CATEGORIES } from "@utils/assets/constants";
import type { Tower } from "../types";

function getCrossPaths(tower: Tower): [number, number, number] {
    return [
        Math.max(0, 5 - (tower.path1NumBlockedTiers !== -1 ? tower.path1NumBlockedTiers : 5)),
        Math.max(0, 5 - (tower.path2NumBlockedTiers !== -1 ? tower.path2NumBlockedTiers : 5)),
        Math.max(0, 5 - (tower.path3NumBlockedTiers !== -1 ? tower.path3NumBlockedTiers : 5))
    ]
}

export function getTowers(towers: Tower[]) {

  const towerCategories = {
    Heroes: [],
    Primary: [],
    Military: [],
    Magic: [],
    Support: [],
  } as Record<keyof typeof CATEGORIES, Array<Tower & { crossPaths: [number, number, number ]}>>;


    for (const tower of towers.filter((tower) => tower.max !== 0)) {
        for (const category of Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>) {
            if (tower.tower in CATEGORIES[category]) {
                towerCategories[category].push({
                ...tower,
                crossPaths: getCrossPaths(tower),
                });
            break;
            }
        }
    }
  return towerCategories;
}