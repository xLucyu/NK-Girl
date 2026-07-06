import { Box } from "../layout/Box";

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoProps {
  items: InfoItem[];
}

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    rows.push(arr.slice(i, i + size));
  }
  return rows;
}

export function Info({ items }: InfoProps) {
  const rows = chunk(items, 2);

  return (
    <Box
      style={{
        flexDirection: "column",
        width: "100%",
        padding: 12,
        gap: 8,
      }}
    >
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {row.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: row.length === 1 ? "100%" : "50%",
                padding: "0 12px",
                gap: 2,
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

              <span
                style={{
                  color: "white",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                {String(item.value)}
              </span>
            </div>
          ))}
        </div>
      ))}
    </Box>
  );
}
