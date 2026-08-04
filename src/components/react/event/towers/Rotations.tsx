import { TowerIcon } from "./TowerIcon";

export interface Rotation {
  instas: string[];
  timeStamp: string;
}

interface RotationsProps {
  rotations: Rotation[];
  allRotations?: Rotation[];
  columns?: number;
}

interface RotationRowProps {
  rotation: Rotation;
  current: boolean;
}

const TOWER_SIZE = 62;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function Rotations({
  rotations,
  allRotations = rotations,
  columns = 2,
}: RotationsProps) {

  if (rotations.length === 0) return null;

  const perColumn = Math.ceil(rotations.length / columns);
  const currentTimestamp = findCurrentTimestamp(allRotations);

  const chunks = Array.from({ length: columns }, (_, i) =>
    rotations.slice(i * perColumn, (i + 1) * perColumn),
  ).filter((chunk) => chunk.length > 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        gap: 12,
      }}
    >
      {chunks.map((chunk, columnIndex) => (
        <div
          key={columnIndex}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
            flex: 1,
          }}
        >
          {chunk.map((rotation) => (
            <RotationRow
              key={rotation.timeStamp}
              rotation={rotation}
              current={rotation.timeStamp === currentTimestamp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function RotationRow({ rotation, current }: RotationRowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "2px 6px",
        borderRadius: 6,
        backgroundColor: current ? "rgba(144, 202, 249, 0.15)" : "transparent",
        border: current
          ? "1px solid rgba(144, 202, 249, 0.5)"
          : "1px solid transparent",
      }}
    >
      <span
        style={{
          color: current ? "#90caf9" : "#c0d0e0",
          fontSize: 12,
          minWidth: 112,
          textTransform: "uppercase",
          opacity: current ? 1 : 0.75,
        }}
      >
        {current ? "NOW" : formatTimestamp(rotation.timeStamp)}
      </span>

      <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
        {rotation.instas.map((towerName) => (
          <TowerIcon key={towerName} towerName={towerName} size={TOWER_SIZE} />
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

function findCurrentTimestamp(all: Rotation[]): string | null {

  const now = Date.now();
  let currentTimestamp: string | null = null;

  for (const rotation of all) {
    if (new Date(rotation.timeStamp).getTime() <= now) {
      currentTimestamp = rotation.timeStamp;
    } else {
      break;
    }
  }

  return currentTimestamp;
}
