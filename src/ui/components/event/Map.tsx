import type { ReactNode } from "react";
import { MapImages } from "@btd6";
import { loadImage } from "@ui/load-image";

interface MapSectionProps {
  map: string;
  width?: number | string;
  height?: number | string;
  iconPath?: string;
  overlay?: ReactNode;
}

export function MapSection({ map, width, height, iconPath, overlay }: MapSectionProps) {

  const mapImageKey = MapImages[map as keyof typeof MapImages];
  if (!mapImageKey) return null;

  const mapImage = loadImage(mapImageKey);
  const iconImage = iconPath ? loadImage(iconPath) : undefined;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        ...(width ? { width } : {}),
        ...(height ? { height } : {})
      }}
    >
      <img
        src={mapImage}
        style={{
          borderRadius: 7,
          objectFit: "cover",
          width: "100%",
          height: "100%"
        }}
      />
      {iconImage ? (
        <img
          src={iconImage}
          width={133}
          height={133}
          style={{ position: "absolute", bottom: 13, right: 13 }}
        />
      ) : null}
      {overlay ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {overlay}
        </div>
      ) : null}
    </div>
  );
}
