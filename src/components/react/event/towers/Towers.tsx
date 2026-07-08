import type { TowerCategories, TowerEntry } from "@utils";
import { Box } from "../../layout/Box";
import { TowerIcon } from "./TowerIcon";
import type { TowerCategory, TowerIconSize, getTowerSize } from "./shared";

interface TowersProps {
  towers: TowerCategories;
}

const NON_HERO_CATEGORIES: TowerCategory[] = ["Primary", "Military", "Magic", "Support"];

export function Towers({ towers }: TowersProps) {

  const heroCount = towers.Heroes.length;
  const towerCount = NON_HERO_CATEGORIES.reduce((sum, c) => sum + towers[c].length, 0);

  if (heroCount === 0 && towerCount === 0) return null;

  const size = getTowerSize(Math.max(heroCount, towerCount));

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
      {heroCount > 0 && (
        <TowerGroup title="Heroes" size={size}>
          {towers.Heroes.map((tower) => (
            <TowerIcon
              key={tower.name}
              towerName={tower.name}
              category="Heroes"
              size={size}
            />
          ))}
        </TowerGroup>
      )}

      {towerCount > 0 && (
        <TowerGroup title="Towers" size={size}>
          {NON_HERO_CATEGORIES.flatMap((category) =>
            towers[category].map((tower) => (
              <TowerIcon
                key={tower.name}
                towerName={tower.name}
                category={category}
                size={size}
                max={formatMax(tower)}
                crossPaths={formatCrossPaths(tower)}
              />
            ))
          )}
        </TowerGroup>
      )}
    </Box>
  );
}

function TowerGroup({ title, children }: {
  title: string;
  size: TowerIconSize;
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

function formatMax(tower: TowerEntry): string | null {
  if (tower.max === -1 || tower.max === 9999) return null;
  return String(tower.max);
}

function formatCrossPaths(tower: TowerEntry): string | null {
  if (!tower.crossPaths) return null;
  if (tower.crossPaths.every((v) => v === 5)) return null;
  return tower.crossPaths.join("-");
}
