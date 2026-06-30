import { Box } from "./Box";

interface MapSectionProps {
  mapImage: string;
  icon?: string;
}

export function MapSection({ mapImage, icon }: MapSectionProps) {
  return (
    <Box style={{ position: "relative" }}>
      <img
        src={mapImage}
        width={540}
        height={300}
        style={{
          borderRadius: 7,
          objectFit: "cover",
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