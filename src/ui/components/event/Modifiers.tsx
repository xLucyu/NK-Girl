import { Box } from "../layout/Box";
import { loadImage } from "@ui/load-image";
import { Modifier, ModifierImages } from "@btd6";

interface ModifiersProps {
  modifiers: Modifier[];
  compact?: boolean;
}

interface ModifierSizing {
  iconSize: number;
  fontSize: number;
  gap: number;
  padding: number;
}

const COLUMN_GAP = 20;

export function Modifiers({ modifiers, compact = false }: ModifiersProps) {
  
  if (modifiers.length === 0) return null;

  if (compact) return <CompactModifiers modifiers={modifiers} />;

  const sizing = getSizing(modifiers.length);
  const columns = splitIntoColumns(modifiers, getColumnCount(modifiers.length));

  return (
    <Box
      style={{
        flexDirection: "column",
        alignSelf: "flex-start",
        gap: 8,
        padding: sizing.padding,
        minWidth: 240,
      }}
    >
      <span
        style={{
          color: "#90caf9",
          fontSize: 16,
          textTransform: "uppercase",
          opacity: 0.8,
          marginBottom: 4,
        }}
      >
        Modifiers
      </span>

      <div style={{ display: "flex", flexDirection: "row", gap: COLUMN_GAP }}>
        {columns.map((column, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: sizing.gap }}
          >
            {column.map((modifier) => (
              <ModifierRow
                key={modifier.label}
                modifier={modifier}
                sizing={sizing}
              />
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
}

function CompactModifiers({ modifiers }: { modifiers: Modifier[] }) {

  const sizing = getCompactSizing(modifiers.length);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: sizing.gap,
        width: "100%",
        alignItems: "center"
      }}
    >
      {modifiers.map((modifier) => (
        <CompactModifierPill
          key={modifier.label}
          modifier={modifier}
          sizing={sizing}
        />
      ))}
    </div>
  );
}

function CompactModifierPill({ modifier, sizing }: {modifier: Modifier; sizing: ModifierSizing; }) {

  const imagePath = modifier.imageKey(modifier.api);
  if (!imagePath) return;

  const value = formatCompactValue(modifier);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: `${sizing.padding}px ${sizing.padding + 2}px`,
      }}
    >
      <img
        src={loadImage(imagePath)}
        width={sizing.iconSize}
        height={sizing.iconSize}
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      {value && (
        <span
          style={{
            color: "white",
            fontSize: sizing.fontSize,
            lineHeight: 1.1,
            textShadow: "0 0 4px black, 0 0 4px black",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function ModifierRow({ modifier, sizing }: { modifier: Modifier; sizing: ModifierSizing; }) {

  const imagePath = modifier.imageKey(modifier.api);
  if (!imagePath) return;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <img
        src={loadImage(imagePath)}
        width={sizing.iconSize}
        height={sizing.iconSize}
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      <span
        style={{ color: "white", fontSize: sizing.fontSize, lineHeight: 1.1 }}
      >
        {formatLabel(modifier)}
      </span>
    </div>
  );
}

function formatLabel(modifier: Modifier): string {
  const { api: value, label, hasKey } = modifier;

  if (typeof value === "boolean") return label;
  if (hasKey) return `${Math.round(Number(value) * 100)}% ${label}`;
  return `${value} ${label}`;
}

function formatCompactValue(modifier: Modifier): string {
  const { api: value, hasKey } = modifier;

  if (typeof value === "boolean") return "";
  if (hasKey) return `${Math.round(Number(value) * 100)}%`;
  return String(value);
}

function getSizing(count: number): ModifierSizing {
  if (count < 6) return { iconSize: 36, fontSize: 16, gap: 8, padding: 12 };
  if (count < 12) return { iconSize: 32, fontSize: 14, gap: 6, padding: 10 };
  return { iconSize: 28, fontSize: 12, gap: 5, padding: 8 };
}

function getCompactSizing(count: number): ModifierSizing {
  if (count < 4) return { iconSize: 28, fontSize: 16, gap: 6, padding: 4 };
  if (count < 8) return { iconSize: 24, fontSize: 14, gap: 5, padding: 3 };
  return { iconSize: 20, fontSize: 12, gap: 4, padding: 2 };
}

function getColumnCount(count: number): number {
  if (count <= 6) return 1;
  if (count <= 12) return 2;
  return 3;
}

function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, i) =>
    items.slice(i * perColumn, (i + 1) * perColumn),
  );
}
