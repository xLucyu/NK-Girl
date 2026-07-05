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

function getTowerMax(tower: TowerWithCategory): string | null {
  if (tower.category === "Heroes") return null;
  if (tower.max === -1 || tower.max === 9999 || tower.max === 0) return null;

  return String(tower.max);
}

function getTowerCrossPaths(tower: TowerWithCategory): string | null {
  if (tower.category === "Heroes") return null;

  if (tower.crossPaths.every((value) => value === 5)) {
    return null;
  }

  return tower.crossPaths.join("-");
}

function toTowerItems(towers: Tower[]): TowerWithCategory[] {
  const grouped = getTowers(towers);

  return Object.entries(grouped).flatMap(([category, towers]) =>
    towers.map((tower) => ({
      ...tower,
      category: category as TowerCategory,
    }))
  );
}

function TowerIcon({ tower }: { tower: TowerWithCategory }) {
  const towerPath = TowerImages[tower.tower as keyof typeof TowerImages];
  const backgroundPath = TowerContainers[tower.category];

  if (!towerPath || !backgroundPath) return null;

  const towerImage = loadImage(towerPath);
  const backgroundImage = loadImage(backgroundPath);

  const max = getTowerMax(tower);
  const crossPaths = getTowerCrossPaths(tower);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 42,
        height: 54,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={backgroundImage}
        width={42}
        height={54}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          objectFit: "fill",
        }}
      />

      <img
        src={towerImage}
        width={33}
        height={33}
        style={{
          objectFit: "contain",
          marginTop: -4,
        }}
      />

      {max ? (
        <span
          style={{
            position: "absolute",
            right: 3,
            top: 2,
            color: "white",
            fontSize: 9,
            fontWeight: "bold",
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
            bottom: 3,
            left: 0,
            right: 0,
            color: "white",
            fontSize: 8,
            fontWeight: "bold",
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
}: {
  title: string;
  towers: TowerWithCategory[];
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
          fontSize: 12,
          fontWeight: "bold",
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
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start",
          gap: 6,
          width: "100%",
        }}
      >
        {towers.map((tower) => (
          <TowerIcon key={tower.tower} tower={tower} />
        ))}
      </div>
    </div>
  );
}

export function Towers({ towers }: TowerPanelProps) {
  const towerItems = toTowerItems(towers);

  const heroes = towerItems.filter((tower) => tower.category === "Heroes");
  const normalTowers = towerItems.filter((tower) => tower.category !== "Heroes");

  if (towerItems.length === 0) return null;

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        gap: 8,
        padding: 10,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <TowerGroup title="Heroes" towers={heroes} />
      <TowerGroup title="Towers" towers={normalTowers} />
    </Box>
  );
}
