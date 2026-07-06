import {
  TowerImages,
  TowerContainers,
  loadImage,
  getTowers,
} from "@utils";
import type { Tower } from "@utils";
import { Box } from "../layout/Box";

interface TowerPanelProps {
  towers: Tower[];
}

type TowerCategory = keyof typeof TowerContainers;

type TowerWithCategory = Tower & {
  category: TowerCategory;
  crossPaths: [number, number, number];
};

type TowerSize = {
  width: number;
  height: number;
  imageSize: number;
};

function getTowerSize(count: number): TowerSize {
  if (count <= 8) return { width: 76, height: 96, imageSize: 74 };
  if (count <= 14) return { width: 64, height: 80, imageSize: 62 };
  if (count <= 20) return { width: 56, height: 70, imageSize: 54 };
  if (count <= 26) return { width: 50, height: 62, imageSize: 48 };
  return { width: 44, height: 56, imageSize: 42 };
}



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

function toTowerItems(towers: Tower[]): TowerWithCategory[] {
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

function TowerIcon({
  tower,
  size,
}: {
  tower: TowerWithCategory;
  size: TowerSize;
}) {
  const towerPath = TowerImages[tower.tower as keyof typeof TowerImages];
  const backgroundPath = TowerContainers[tower.category];
  if (!towerPath || !backgroundPath) return null;

  const max = getTowerMax(tower);
  const crossPaths = getTowerCrossPaths(tower);

  const maxFontSize = Math.max(9, Math.round(size.width * 0.2));
  const crossPathFontSize = Math.max(8, Math.round(size.width * 0.18));

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size.width,
        height: size.height,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={loadImage(backgroundPath)}
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          objectFit: "fill",
        }}
      />
      <img
        src={loadImage(towerPath)}
        width={size.imageSize}
        height={size.imageSize}
        style={{
          objectFit: "contain",
          marginTop: -Math.round(size.height * 0.04),
        }}
      />

      {max ? (
        <span
          style={{
            position: "absolute",
            right: 4,
            top: 3,
            color: "white",
            fontSize: maxFontSize,
            textShadow: "0 1px 2px black",
          }}
        >
          {max}
        </span>
      ) : null}

      {crossPaths ? (
        <span
          style={{
            position: "absolute",
            bottom: 4,
            left: 0,
            right: 0,
            color: "white",
            fontSize: crossPathFontSize,
            textAlign: "center",
            textShadow: "0 1px 2px black",
          }}
        >
          {crossPaths}
        </span>
      ) : null}
    </div>
  );
}

function TowerGroup({
  title,
  towers,
  size,
}: {
  title: string;
  towers: TowerWithCategory[];
  size: TowerSize;
}) {
  if (towers.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
      }}
    >
      <span
        style={{
          color: "#90caf9",
          fontSize: 14,
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
          gap: 8,
          width: "100%",
        }}
      >
        {towers.map((tower) => (
          <TowerIcon key={tower.tower} tower={tower} size={size} />
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

  const size = getTowerSize(Math.max(heroes.length, rest.length));

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        gap: 8,
        padding: 10,
        width: "100%",
      }}
    >
      <TowerGroup title="Heroes" towers={heroes} size={size} />
      <TowerGroup title="Towers" towers={rest} size={size} />
    </Box>
  );
}
