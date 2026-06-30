interface HeaderProps {
  eventType: string;
  eventName: string;
  difficulty?: string;
}

export function Header({ eventType, eventName, difficulty }: HeaderProps) {

  const parts = [eventType, eventName];
  if (difficulty) parts.push(difficulty);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderRadius: 14,
        padding: "13px 21px",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
      }}
    >
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
    </div>
  );
}