import { TowerContainers, getTowers } from "@utils";
import type { TowerEntry } from "@utils";
import { Box } from "../../layout/Box";
import { TowerIcon } from "./TowerIcon";
import {
  TowerCategory,
  TowerIconSize,
  getBossTowerSize,
} from "./shared";

interface TowerPanelProps {
  towers: /* whatever type your API sends — the raw Tower[] */ any[];
}

type TowerWithCategory = TowerEntry & { category: TowerCategory };

function getTowerMax(tower: TowerWithCategory): string | null {
  if (tower.category === "Heroes") return null;
  if (tower.max === -1 || tower.max === 9999) return null;
  return String(tower.max);
}

function getTowerCrossPaths(tower: TowerWithCategory): string | null {
  if (tower.category === "Heroes") return null;
  if (tower.crossPaths.every((v) => v === 5)) return null;
  return tower.crossPaths.join("-");
}

function toTowerItems(towers: any[]): TowerWithCategory[] {
  let grouped;
  try {
    grouped = getTowers(towers);
  } catch (error) {
    console.warn("[Towers] getTowers threw, rendering empty tower list:", error);
    return [];
  }

  return Object.entries(grouped).flatMap(([category, towers]) => {
    if (!(category in TowerContainers)) {
      console.warn(`[Towers] unknown category "${category}", skipping`);
      return [];
    }
    return towers.map((tower) => ({
      ...tower,
      category: category as TowerCategory,
    }));
  });
}

function TowerGroup({
  title,
  towers,
  size,
}: {
  title: string;
  towers: TowerWithCategory[];
  size: TowerIconSize;
}) {
  if (towers.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
      }}
    >
      <span
        style={{
          color: "#90caf9",
          fontSize: 16,
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        {title}
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
          alignContent: "flex-start",
          gap: 10,
          width: "100%",
        }}
      >
        {towers.map((tower) => (
          <TowerIcon
            key={tower.name}
            towerName={tower.name}
            category={tower.category}
            size={size}
            max={getTowerMax(tower)}
            crossPaths={getTowerCrossPaths(tower)}
          />
        ))}
      </div>
    </div>
  );
}

export function Towers({ towers }: TowerPanelProps) {
  const items = toTowerItems(towers);
  if (items.length === 0) return null;

  const heroes = items.filter((t) => t.category === "Heroes");
  const rest = items.filter((t) => t.category !== "Heroes");

  const size = getBossTowerSize(Math.max(heroes.length, rest.length));

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        gap: 10,
        padding: 12,
        width: "100%",
      }}
    >
      <TowerGroup title="Heroes" towers={heroes} size={size} />
      <TowerGroup title="Towers" towers={rest} size={size} />
    </Box>
  );
}
