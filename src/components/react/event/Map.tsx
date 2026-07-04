import { MapImages, loadImage } from "@utils";
import { Box } from "../layout/Box";


interface MapSectionProps {
  map: string;
  iconPath?: string;
  width?: number | string;
  height?: number | string;
}

export function MapSection({ map, iconPath, width, height }: MapSectionProps) {

  const mapImage = loadImage(MapImages[map as keyof typeof MapImages]);
  const iconImage = iconPath ? loadImage(iconPath) : undefined; 

  return (
    <Box style={{ position: "relative", width: "auto" }}>
      <img
        src={mapImage}
        style={{
          borderRadius: 7,
          objectFit: "cover",
          ...(width ? { width } : {}),
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
    </Box>
  );
}
