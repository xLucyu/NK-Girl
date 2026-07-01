import { Box } from "./Box";

interface TimeBarProps {
  start: number; // Unix timestamp ms
  end: number;   // Unix timestamp ms
}

export function TimeBar({ start, end }: TimeBarProps) {

  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  const progress = Math.min(1, Math.max(0, elapsed / total));

  const remainingMs = Math.max(0, end - now);
  const days = Math.floor(remainingMs / 86400000);
  const hours = Math.floor((remainingMs % 86400000) / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);

  const remaining = days > 0
    ? `${days}d ${hours}h ${minutes}m remaining`
    : `${hours}h ${minutes}m remaining`;

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  return (
    <Box style={{ flexDirection: "column", padding: 20, gap: 6 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ color: "#c0d0e0", fontSize: 16, fontWeight: "bold" }}>
          {formatDate(start)}
        </span>
        <span style={{ color: "#c0d0e0", fontSize: 16, fontWeight: "bold" }}>
          {formatDate(end)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: 15,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 6,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: "#5b8cc0",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#90b8e0",
            top: -4,
            left: `${progress * 100}%`,
            marginLeft: -10,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span style={{ color: "#90a8c0", fontSize: 14 }}>
          {remaining}
        </span>
      </div>
    </Box>
  );
}
