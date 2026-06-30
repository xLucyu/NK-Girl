import { Box } from "./Box";

interface InfoItem {
  label: string;
  value: string;
}

interface InfoSectionProps {
  items: InfoItem[];
}

export function InfoSection({ items }: InfoSectionProps) {

  const rows: InfoItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  
  return (
    <Box style={{ flexDirection: "column", flex: 1 }}>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom:
              i < rows.length - 1
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "none",
          }}
        >
          {row.map((item, j) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "50%",
                padding: "8px 12px",
                borderRight:
                  j === 0 && row.length > 1
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "none",
              }}
            >
              <span
                style={{
                  color: "#90caf9",
                  fontSize: 11,
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
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </Box>
  );
}