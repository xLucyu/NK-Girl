import { Box } from "../layout/Box";

interface ProgressBarProps {
  start: number;
  end: number;
}

const TRACK_HEIGHT = 10;
const KNOB_SIZE = 14;

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
};

export function ProgressBar({ start, end }: ProgressBarProps) {
  const now = Date.now();
  const total = end - start;
  const progress = total <= 0 ? 1 : Math.min(1, Math.max(0, (now - start) / total));

  const remainingMs = Math.max(0, end - now);
  const days = Math.floor(remainingMs / 86400000);
  const hours = Math.floor((remainingMs % 86400000) / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);

  const remaining =
    remainingMs === 0
      ? "Ended"
      : days > 0
      ? `${days}d ${hours}h ${minutes}m remaining`
      : `${hours}h ${minutes}m remaining`;

  const progressPct = `${progress * 100}%`;

   return (
    <Box style={{ flexDirection: "column", padding: 12, gap: 4 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ color: "#c0d0e0", fontSize: 13 }}>{formatDate(start)}</span>
        <span style={{ color: "#c0d0e0", fontSize: 13 }}>{formatDate(end)}</span>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: TRACK_HEIGHT,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: TRACK_HEIGHT / 2,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: progressPct,
            height: "100%",
            backgroundColor: "#5b8cc0",
            borderRadius: TRACK_HEIGHT / 2,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: "#90b8e0",
            top: (TRACK_HEIGHT - KNOB_SIZE) / 2,
            left: progressPct,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <span style={{ color: "#90a8c0", fontSize: 12 }}>{remaining}</span>
      </div>
    </Box>
  );
}
