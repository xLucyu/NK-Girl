import {
  loadImage,
  buildModifiers,
  filterModifiers,
  MetaBody,
  Modifier,
  ModifierImages,
  splitUppercase,
} from "@utils";
import { Box } from "../layout/Box";

interface ModifiersProps {
  metaData: MetaBody;
}

function formatModifierLabel(modifier: Modifier): string {
  const value = modifier.api;
  const name = splitUppercase(modifier.key);

  if (typeof value === "boolean") return name;
  if (modifier.hasKey) return `${value}x ${name}`;
  return `${value} ${name}`;
}

function getModifierSizing(count: number): {
  iconSize: number;
  fontSize: number;
  gap: number;
  padding: number;
} {
  if (count <= 4) return { iconSize: 36, fontSize: 16, gap: 8, padding: 12 };
  if (count <= 7) return { iconSize: 30, fontSize: 14, gap: 6, padding: 10 };
  return { iconSize: 26, fontSize: 12, gap: 4, padding: 8 };
}

export function Modifiers({ metaData }: ModifiersProps) {
  const modifiers = filterModifiers(buildModifiers(metaData));
  if (modifiers.length === 0) return null;

  const sizing = getModifierSizing(modifiers.length);

  return (
    <Box
      style={{
        flexDirection: "column",
        alignSelf: "flex-start",
        gap: sizing.gap,
        padding: sizing.padding,
        minWidth: 240,
      }}
    >
      {modifiers.map((modifier) => {
        const imageKey = modifier.imageKey(modifier.api);
        if (!imageKey) return null;

        const imagePath = ModifierImages[imageKey as keyof typeof ModifierImages];
        if (!imagePath) return null;

        return (
          <ModifierRow
            key={modifier.key}
            imagePath={imagePath}
            label={formatModifierLabel(modifier)}
            iconSize={sizing.iconSize}
            fontSize={sizing.fontSize}
          />
        );
      })}
    </Box>
  );
}

function ModifierRow({
  imagePath,
  label,
  iconSize,
  fontSize,
}: {
  imagePath: string;
  label: string;
  iconSize: number;
  fontSize: number;
}) {
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
        width={iconSize}
        height={iconSize}
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      <span
        style={{
          color: "white",
          fontSize,
          lineHeight: 1.1,
        }}
      >
        {label}
      </span>
    </div>
  );
}
