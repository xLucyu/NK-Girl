import type { TowerCategories, TowerEntry } from "@btd6";
import { Box } from "../../layout/Box";
import { TowerIcon } from "./TowerIcon";
import { TowerCategory, getTowerSize } from "./sizes";

interface TowersProps {
  towers: TowerCategories;
  compact?: boolean;
}

const NON_HERO_CATEGORIES: TowerCategory[] = ["Primary", "Military", "Magic", "Support"];

export function Towers({ towers, compact = false }: TowersProps) {
  const heroCount = towers.Heroes.length;
  const towerCount = NON_HERO_CATEGORIES.reduce((sum, c) => sum + towers[c].length, 0);

  if (heroCount === 0 && towerCount === 0) return null;

  if (compact) return <CompactTowers towers={towers} heroCount={heroCount} towerCount={towerCount} />;

  const size = getTowerSize(Math.max(heroCount, towerCount));

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        padding: 12,
        width: "100%",
      }}
    >
      {heroCount > 0 && (
        <TowerGroup title="Heroes">
          {towers.Heroes.map((tower) => (
            <TowerIcon key={tower.name} towerName={tower.name} size={size} />
          ))}
        </TowerGroup>
      )}

      {towerCount > 0 && (
        <TowerGroup title="Towers">
          {NON_HERO_CATEGORIES.flatMap((category) =>
            towers[category].map((tower) => (
              <TowerIcon
                key={tower.name}
                towerName={tower.name}
                size={size}
                max={formatMax(tower)}
                crossPaths={formatCrossPaths(tower)}
              />
            )),
          )}
        </TowerGroup>
      )}
    </Box>
  );
}

function CompactTowers({
  towers,
  heroCount,
  towerCount,
}: {
  towers: TowerCategories;
  heroCount: number;
  towerCount: number;
}) {
  const size = getCompactTowerSize(Math.max(heroCount, towerCount));

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        padding: 8,
        width: "100%",
      }}
    >
      {heroCount > 0 && (
        <CompactTowerGroup title="Heroes">
          {towers.Heroes.map((tower) => (
            <TowerIcon key={tower.name} towerName={tower.name} size={size} />
          ))}
        </CompactTowerGroup>
      )}

      {towerCount > 0 && (
        <CompactTowerGroup title="Towers">
          {NON_HERO_CATEGORIES.flatMap((category) =>
            towers[category].map((tower) => (
              <TowerIcon
                key={tower.name}
                towerName={tower.name}
                size={size}
                max={formatMax(tower)}
                crossPaths={formatCrossPaths(tower)}
              />
            )),
          )}
        </CompactTowerGroup>
      )}
    </Box>
  );
}

function CompactTowerGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
          fontSize: 13,
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
          gap: 6,
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}


function TowerGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
        {children}
      </div>
    </div>
  );
}


function getCompactTowerSize(maxCount: number): number {
  const normalSize = getTowerSize(maxCount);
  return Math.round(normalSize * 0.85);
}

function formatMax(tower: TowerEntry): string | null {
  if (tower.max === -1 || tower.max === 9999) return null;
  return String(tower.max);
}

function formatCrossPaths(tower: TowerEntry): string | null {
  if (!tower.crossPaths) return null;
  if (tower.crossPaths.every((v) => v === 5)) return null;
  return tower.crossPaths.join("-");
}
