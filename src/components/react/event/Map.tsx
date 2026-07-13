import { MapImages, loadImage } from "@utils";

interface MapSectionProps {
  map: string;
  width?: number | string;
  height?: number | string;
  iconPath?: string;
}

export function MapSection({
  map,
  width,
  height,
  iconPath,
}: MapSectionProps) {

  const mapImage = loadImage(MapImages[map as keyof typeof MapImages]);
  const iconImage = iconPath ? loadImage(iconPath) : undefined;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        ...(width ? { width } : {}),
      }}
    >
      <img
        src={mapImage}
        style={{
          borderRadius: 7,
          objectFit: "cover",
          width: "100%",
          ...(height ? { height } : {}),
        }}
      />
      {iconImage ? (
        <img
          src={iconImage}
          width={133}
          height={133}
          style={{
            position: "absolute",
            bottom: 13,
            right: 13,
          }}
        />
      ) : null}
    </div>
  );
}
