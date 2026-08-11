import {
  CATEGORIES,
  TowerImages,
  TowerContainers,
  loadImage,
  TOWER_INFO,
} from "@utils";
import { TowerCategory } from "./sizes";

interface TowerIconProps {
  towerName: string;
  size: number;
  max?: string | null;
  crossPaths?: string | null;
  blocked?: boolean;
}

const CATEGORY_LOOKUP: Record<string, TowerCategory> = (() => {
  const map: Record<string, TowerCategory> = {};

  for (
    const [category, towers] of Object.entries(CATEGORIES) as [
      TowerCategory,
      string[],
    ][]
  ) {
    for (const tower of towers) {
      map[tower] = category;
    }
  }

  return map;
})();

export function TowerIcon({
  towerName,
  size,
  max,
  crossPaths,
  blocked = false,
}: TowerIconProps) {

  const towerInfo = TOWER_INFO[towerName];
  if (!towerInfo) return null;

  const towerPath = TowerImages[towerName as keyof typeof TowerImages];
  const backgroundPath = TowerContainers[towerInfo.category as keyof typeof TowerContainers];

  if (!towerPath || !backgroundPath) return null;

  const badgeSize = Math.max(22, Math.round(size * 0.4));
  const badgeFontSize = Math.max(11, Math.round(size * 0.3));

  const blockedOverlayPath =
    "Blocked" in TowerContainers
      ? TowerContainers.Blocked
      : null;

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
        opacity: blocked ? 0.85 : 1,
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
        style={{
          position: "relative",
          objectFit: "contain",
          borderRadius: 10,
        }}
      />

      {blocked && blockedOverlayPath && (
        <img
          src={loadImage(blockedOverlayPath)}
          width={badgeSize}
          height={badgeSize}
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            objectFit: "contain",
          }}
        />
      )}

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
              marginTop: 6,
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
              fontSize: Math.max(
                11,
                Math.round(size * 0.3),
              ),
              fontWeight: 900,
              letterSpacing: 1,
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 3px #000",
            }}
          >
            {crossPaths}
          </span>
        </div>
      )}
    </div>
  );
}
