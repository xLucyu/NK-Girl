import { TowerImages, TowerContainers, loadImage } from "@utils";
import type { TowerCategory, TowerIconSize } from "./shared";

interface TowerIconProps {
  towerName: string;
  category: TowerCategory;
  size: TowerIconSize;
  max?: string | null;
  crossPaths?: string | null;
}

export function TowerIcon({
  towerName,
  category,
  size,
  max,
  crossPaths,
}: TowerIconProps) {
  const towerPath = TowerImages[towerName as keyof typeof TowerImages];
  const backgroundPath = TowerContainers[category];
  if (!towerPath || !backgroundPath) return null;

  const maxFontSize = Math.max(10, Math.round(size.width * 0.18));
  const crossPathFontSize = Math.max(11, Math.round(size.width * 0.22));

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
        style={{
          objectFit: "contain",
          borderRadius: 10,
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
            textShadow:
              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          {max}
        </span>
      ) : null}

{crossPaths ? (
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
        fontSize: crossPathFontSize,
        textShadow:
          "-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000",
        letterSpacing: 1,
      }}
    >
      {crossPaths}
    </span>
  </div>
) : null}
    </div>
  );
}
