import { TowerContainers } from "@utils";

export type TowerCategory = keyof typeof TowerContainers;

export function getTowerSize(count: number): number {
  if (count <= 8) return 92;
  if (count <= 14) return 78;
  if (count <= 20) return 64;
  if (count <= 26) return 56;
  return 48;
}

export function getRotationTowerSize(rotationCount: number): number {
  if (rotationCount <= 3) return 88;
  if (rotationCount <= 5) return 72;
  if (rotationCount <= 7) return 60;
  return 52;
}
