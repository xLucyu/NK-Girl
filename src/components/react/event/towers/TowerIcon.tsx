import { 
  CATEGORIES, 
  TowerImages, 
  TowerContainers, 
  loadImage 
} from "@utils";
import { TowerCategory } from "./tower.sizes";

interface TowerIconProps {
  towerName: string;
  size: number;
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

  const badgeSize = Math.max(22, Math.round(size * 0.36));
  const badgeFontSize = Math.max(11, Math.round(size * 0.2));


  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={loadImage(backgroundPath)}
        width={size}
        height={size}
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
        width={size}
        height={size}
        style={{ objectFit: "contain", borderRadius: 10 }}
      />

      {max && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: -4,
            top: -4,
            width: badgeSize,
            height: badgeSize,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={loadImage(TowerContainers.Max)}
            width={badgeSize}
            height={badgeSize}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              objectFit: "contain",
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: badgeFontSize,
              fontWeight: 700,
              lineHeight: 1,
              marginTop: 6, // optical centering — badge art has more space at the bottom
            }}
          >
            {max}
          </span>
        </div>
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
              fontSize: Math.max(11, Math.round(size * 0.22)),
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
