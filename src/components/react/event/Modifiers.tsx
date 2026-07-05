import { 
    loadImage,
    buildModifiers,
    filterModifiers, 
    MetaBody, 
    Modifier, 
    ModifierImages
} from "@utils";
import { Box } from "../layout/Box";

interface ModifiersProps {
  metaData: MetaBody;
}

function formatModifierValue(modifier: Modifier): string | null {

  const value = modifier.api;

  if (typeof value === "boolean") return null;

  if (modifier.hasKey) {
    return `${value}x`;
  }

  return String(value);
}

function getModifierSize(count: number) {
  if (count <= 6) return 58;
  if (count <= 9) return 52;
  return 46;
}

export function Modifiers({ metaData }: ModifiersProps) {

  const modifiers = filterModifiers(buildModifiers(metaData));

  if (modifiers.length === 0) return null;

  const size = getModifierSize(modifiers.length);
  const imageSize = size - 12;

  return (
    <Box
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 12,
      }}
    >
      {modifiers.map((modifier) => {

        const imageKey = modifier.imageKey(modifier.api);

        if (!imageKey) return null;

        const imagePath =
          ModifierImages[imageKey as keyof typeof ModifierImages];

        if (!imagePath) return null;

        const image = loadImage(imagePath);
        const value = formatModifierValue(modifier);

        return (
          <div
            key={modifier.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: size,
              height: size,
              position: "relative",
              borderRadius: 10,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <img
              src={image}
              width={imageSize}
              height={imageSize}
              style={{
                objectFit: "contain",
              }}
            />

            {value ? (
              <span
                style={{
                  position: "absolute",
                  right: 3,
                  bottom: 2,
                  color: "white",
                  fontSize: 11,
                  fontWeight: "bold",
                  textShadow: "0 1px 2px black",
                }}
              >
                {value}
              </span>
            ) : null}
          </div>
        );
      })}
    </Box>
  );
}