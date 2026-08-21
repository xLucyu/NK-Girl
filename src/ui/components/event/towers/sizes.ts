import { TowerCategories } from "@btd6";

export type TowerCategory = keyof TowerCategories;

export function getTowerSize(count: number): number {
  if (count <= 8) return 92;
  if (count <= 14) return 78;
  if (count <= 20) return 64;
  if (count <= 26) return 56;
  return 48;
}