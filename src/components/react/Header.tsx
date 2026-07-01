import { Box } from "./Box";

interface HeaderProps {
  eventType: string;
  eventName: string;
  difficulty?: string;
}

export function Header({ eventType, eventName, difficulty }: HeaderProps) {

  const parts = [eventType, eventName];
  if (difficulty) parts.push(difficulty);

  return (
    <Box style={{ alignItems: "center", width: "100%", justifyContent: "center" }}>
      <div
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: 3,
          lineHeight: 1,
        }}
      >
        {parts.join("   -   ")}
      </div>
    </Box>
  );
}
