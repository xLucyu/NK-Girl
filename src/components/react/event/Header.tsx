import { Box } from "../layout/Box";

interface HeaderProps {
  eventType: string;
  eventName: string;
  difficulty?: string;
}

export function Header({ eventType, eventName, difficulty }: HeaderProps) {

  const parts = difficulty ? [eventType, eventName, difficulty] : [eventType, eventName];

  return (
    <Box style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 28,
          textTransform: "uppercase",
          letterSpacing: 3,
          lineHeight: 1,
          height: "100%",
          marginTop: 10,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {parts.join("   -   ")}
      </div>
    </Box>
  );
}
