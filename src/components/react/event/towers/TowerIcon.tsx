import { CATEGORIES, TowerImages, TowerContainers, loadImage } from "@utils";
import type { TowerCategory, TowerIconSize } from "./tower.sizes";

interface TowerIconProps {
  towerName: string;
  size: TowerIconSize;
  max?: string | null;
  crossPaths?: string | null;
}

const CATEGORY_LOOKUP: Record<string, TowerCategory> = (() => {
  const map: Record<string, TowerCategory> = {};
  for (const [category, towers] of Object.entries(CATEGORIES) as [TowerCategory, string[]][]) {
    for (const tower of towers) map[tower] = category;
  }
  return map;
})();

export function TowerIcon({ towerName, size, max, crossPaths }: TowerIconProps) {
  const category = CATEGORY_LOOKUP[towerName];
  if (!category) return null;

  const towerPath = TowerImages[towerName as keyof typeof TowerImages];
  const backgroundPath = TowerContainers[category];
  if (!towerPath || !backgroundPath) return null;

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
          borderRadius: 10,
          objectFit: "fill",
        }}
      />
      <img
        src={loadImage(towerPath)}
        width={size.imageSize}
        height={size.imageSize}
        style={{ objectFit: "contain", borderRadius: 10 }}
      />

      {max && (
        <span
          style={{
            position: "absolute",
            right: 4,
            top: 3,
            color: "white",
            fontSize: Math.max(10, Math.round(size.width * 0.18)),
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          {max}
        </span>
      )}

      {crossPaths && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#ff3838",
              fontSize: Math.max(11, Math.round(size.width * 0.22)),
              letterSpacing: 1,
              textShadow: "-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000",
            }}
          >
            {crossPaths}
          </span>
        </div>
      )}
    </div>
  );
}
