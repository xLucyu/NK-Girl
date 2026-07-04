import { Box } from "../layout/Box";

interface InfoItem {
  label: string;
  value: string | number | boolean;
}

interface InfoProps {
  items: InfoItem[];
}

export function Info({ items }: InfoProps) {
  
  const rows: InfoItem[][] = [];

  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <Box style={{ flexDirection: "column", width: "100%", padding: 8 }}>
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
                width: "50%",
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  color: "#90caf9",
                  fontSize: 16,
                  fontWeight: "bold",
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
                  fontWeight: "bold",
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