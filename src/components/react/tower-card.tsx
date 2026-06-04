// src/components/react/towers/tower-grid.tsx
import { JSX } from "react";
import { loadImage, Images, CATEGORIES, Tower, getTowers } from "@utils";

type CategoryName = keyof typeof CATEGORIES;

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Heroes: "#e6c832",
  Primary: "#d45a5a",
  Military: "#4a8c3f",
  Magic: "#8b5ec0",
  Support: "#c27830",
};

interface TowerGridProps {
  towers: Tower[];
  gap?: number;
  columns?: number;
  categoryGap?: number;
}

function TowerIcon({ tower, crossPaths, color, isHero }: {
  tower: Tower;
  crossPaths: [number, number, number];
  color: string;
  isHero: boolean;
}): JSX.Element {
  const imagePath = Images.Towers[tower.tower as keyof typeof Images.Towers];
  if (!imagePath) return <div style={{ width: 64, height: 64 }} />;

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 64,
        height: 64,
        backgroundColor: color,
        borderRadius: 8,
      }}
    >
      <img
        src={loadImage(imagePath)}
        width={56}
        height={56}
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          borderRadius: 4,
        }}
      />

      {/* Max count — hide for unlimited (-1) */}
      {tower.max > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: -4,
            left: -4,
            width: 20,
            height: 20,
            backgroundColor: "#4a90d9",
            borderRadius: "50%",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
          }}
        >
          {tower.max}
        </div>
      )}

      {/* Crosspath text */}
      {!isHero && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 2,
            left: 0,
            width: 64,
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {crossPaths[0]}-{crossPaths[1]}-{crossPaths[2]}
        </div>
      )}
    </div>
  );
}

export function TowerGrid({
  towers,
  gap = 6,
  columns = 7,
  categoryGap = 14,
}: TowerGridProps): JSX.Element {

  const grouped = getTowers(towers);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: categoryGap }}>
      {(Object.entries(grouped) as [CategoryName, ReturnType<typeof getTowers>[CategoryName]][])
        .filter(([_, t]) => t.length > 0)
        .map(([category, categoryTowers]) => (
          <div
            key={category}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap,
              maxWidth: columns * (64 + gap),
            }}
          >
            {categoryTowers.map((t) => (
              <TowerIcon
                key={t.tower}
                tower={t}
                crossPaths={t.crossPaths}
                color={CATEGORY_COLORS[category]}
                isHero={category === "Heroes"}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
