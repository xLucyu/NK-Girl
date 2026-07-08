import { Box } from "../../layout/Box";
import { TowerIcon } from "./TowerIcon";
import { getRotationTowerSize } from "./tower.sizes";

export interface Rotation {
  instas: string[];
  timeStamp: string;
}

interface RotationsProps {
  rotations: Rotation[];
}

interface RotationRow {
  rotation: Rotation;
  size: number;
  current: boolean;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function Rotations({ rotations }: RotationsProps) {

  if (rotations.length === 0) return null;

  const size = getRotationTowerSize(rotations.length);

  return (
    <Box
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        gap: 10,
        padding: 12,
        width: "100%",
      }}
    >
      {rotations.map((rotation, index) => (
        <RotationRow
          key={rotation.timeStamp}
          rotation={rotation}
          size={size}
          current={isCurrentRotation(rotations, index)}
        />
      ))}
    </Box>
  );
}

function RotationRow({ rotation, size, current }: RotationRow) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "6px 10px",
        borderRadius: 8,
        backgroundColor: current ? "rgba(144, 202, 249, 0.15)" : "transparent",
        border: current
          ? "1px solid rgba(144, 202, 249, 0.5)"
          : "1px solid transparent",
      }}
    >
      <span
        style={{
          color: current ? "#90caf9" : "#c0d0e0",
          fontSize: 14,
          minWidth: 140,
          textTransform: "uppercase",
          opacity: current ? 1 : 0.75,
        }}
      >
        {current ? "NOW" : formatTimestamp(rotation.timeStamp)}
      </span>

      <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        {rotation.instas.map((towerName) => (
          <TowerIcon key={towerName} towerName={towerName} size={size} />
        ))}
      </div>
    </div>
  );
}

function formatTimestamp(iso: string): string {

  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month}, ${hh}:${mm} UTC`;
}

function isCurrentRotation(rotations: Rotation[], index: number): boolean {

  const now = Date.now();
  const start = new Date(rotations[index].timeStamp).getTime();
  const end =
    index + 1 < rotations.length
      ? new Date(rotations[index + 1].timeStamp).getTime()
      : Infinity;
  return now >= start && now < end;
}
