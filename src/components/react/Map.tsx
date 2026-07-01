import { Box } from "./Box";

interface MapSectionProps {
  mapImage: string;
  icon?: string;
  width?: number | string;
  height?: number | string;
}

export function MapSection({ mapImage, icon, width, height }: MapSectionProps) {
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
      {icon ? (
        <img
          src={icon}
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
