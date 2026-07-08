import { CATEGORIES, TowerContainers } from "@utils";

export type TowerCategory = keyof typeof TowerContainers;

export type TowerIconSize = {
  width: number;
  height: number;
  imageSize: number;
};

export const CATEGORY_ORDER: TowerCategory[] = [
  "Heroes",
  "Primary",
  "Military",
  "Magic",
  "Support",
];

const CATEGORY_LOOKUP: Record<string, TowerCategory> = (() => {
  const map: Record<string, TowerCategory> = {};
  for (const [category, towers] of Object.entries(CATEGORIES) as [TowerCategory, string[]][]) {
    for (const tower of towers) {
      map[tower] = category;
    }
  }
  return map;
})();

export function getTowerCategory(towerName: string): TowerCategory | null {
  return CATEGORY_LOOKUP[towerName] ?? null;
}

export function sortByCategory<T>(
  items: T[],
  getName: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    const ca = getTowerCategory(getName(a));
    const cb = getTowerCategory(getName(b));
    const ia = ca ? CATEGORY_ORDER.indexOf(ca) : 999;
    const ib = cb ? CATEGORY_ORDER.indexOf(cb) : 999;
    return ia - ib;
  });
}

export function getTowerSize(count: number): TowerIconSize {
  if (count <= 8) return { width: 92, height: 92, imageSize: 92 };
  if (count <= 14) return { width: 78, height: 78, imageSize: 78 };
  if (count <= 20) return { width: 64, height: 64, imageSize: 64 };
  if (count <= 26) return { width: 56, height: 56, imageSize: 56 };
  return { width: 48, height: 48, imageSize: 48 };
}

export function getRotationTowerSize(rotationCount: number): TowerIconSize {
  if (rotationCount <= 3) return { width: 88, height: 88, imageSize: 88 };
  if (rotationCount <= 5) return { width: 72, height: 72, imageSize: 72 };
  if (rotationCount <= 7) return { width: 60, height: 60, imageSize: 60 };
  return { width: 52, height: 52, imageSize: 52 };
}
