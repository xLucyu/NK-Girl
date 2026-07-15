import { loadImage } from "@utils";
import { Box } from "../layout/Box";

interface InfoItem {
  label: string;
  value: string | number;
  image?: string;
}

interface InfoProps {
  items: InfoItem[];
}

interface InfoCellProps {
  item: InfoItem;
  fullWidth: boolean;
}

const ITEMS_PER_ROW = 2;

export function Info({ items }: InfoProps) {

  const rows = chunk(items, ITEMS_PER_ROW);

  return (
    <Box
      style={{
        flexDirection: "column",
        width: "100%",
        flex: 1,
        padding: 12,
        gap: 8,
      }}
    >
      {rows.map((row, i) => (
        <div
          key={i}
          style={{ display: "flex", flexDirection: "row", flex: 1 }}
        >
          {row.map((item) => (
            <InfoCell
              key={item.label}
              item={item}
              fullWidth={row.length === 1}
            />
          ))}
        </div>
      ))}
    </Box>
  );
}

function InfoCell({ item, fullWidth }: InfoCellProps) {

  const src = item.image ? loadImage(item.image) : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: fullWidth ? "100%" : "50%",
        padding: "0 12px",
        gap: 8,
      }}
    >
      <span
        style={{
          color: "#90caf9",
          fontSize: 15,
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {item.label}
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {src ? (
          <img
            src={src}
            width={26}
            height={26}
            style={{ objectFit: "contain", flexShrink: 0, marginTop: 6 }}
          />
        ) : null}
        <span style={{ 
          color: "white", 
          fontSize: 22, 
          lineHeight: 1,
          marginTop: 12
          }}>
          {String(item.value)}
        </span>
      </div>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    rows.push(arr.slice(i, i + size));
  }
  return rows;
}
