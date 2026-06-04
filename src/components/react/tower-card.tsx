import { Images } from "@utils";
import { getTowers } from "@utils";
import { loadImage } from "@utils";
import type { Tower } from "@utils";

type TowerCategories = ReturnType<typeof getTowers>;
type CategoryName = keyof TowerCategories;

interface TowerAvailabilityProps {
  towers: Tower[];
}

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Heroes: "#ffd91a",
  Primary: "#6fd6ff",
  Military: "#72de57",
  Magic: "#9d63ff",
  Support: "#f0b06a",
};

export function TowerAvailability({ towers }: TowerAvailabilityProps) {
  const categories = getTowers(towers);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "#36476b",
        padding: 16,
        gap: 14,
        boxSizing: "border-box",
      }}
    >
      {(Object.entries(categories) as [CategoryName, TowerCategories[CategoryName]][]).map(
        ([category, categoryTowers]) =>
          categoryTowers.length > 0 ? (
            <TowerCategorySection
              key={category}
              title={`${category.toUpperCase()} AVAILABLE:`}
              category={category}
              towers={categoryTowers}
            />
          ) : null
      )}
    </div>
  );
}

interface TowerCategorySectionProps {
  title: string;
  category: CategoryName;
  towers: TowerCategories[CategoryName];
}

function TowerCategorySection({
  title,
  category,
  towers,
}: TowerCategorySectionProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 900,
          textTransform: "uppercase",
          WebkitTextStroke: "2px #162033",
          textShadow: "0 3px 0 rgba(0,0,0,0.35)",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          paddingBottom: 8,
          borderBottom: "6px solid rgba(255,255,255,0.05)",
        }}
      >
        {towers.map((tower) => (
          <TowerTile
            key={tower.tower}
            towerName={tower.tower}
            category={category}
            crossPaths={tower.crossPaths}
          />
        ))}
      </div>
    </div>
  );
}

interface TowerTileProps {
  towerName: string;
  category: CategoryName;
  crossPaths: [number, number, number];
}

function TowerTile({ towerName, category, crossPaths }: TowerTileProps) {
  const imagePath = Images.Towers[towerName as keyof typeof Images.Towers];
  if (!imagePath) return <div style={{ width: 64, height: 64 }} />;
  const imageSrc = loadImage(imagePath);
  const showCrossPaths = category !== "Heroes";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: 84,
        height: 84,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CATEGORY_COLORS[category],
        borderRadius: 6,
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.22)",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.18)",
      }}
    >
      <img
        src={imageSrc}
        width={72}
        height={72}
        style={{
          objectFit: "contain",
        }}
      />

      {showCrossPaths && (
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            color: "#ff2a2a",
            fontSize: 20,
            fontWeight: 900,
            WebkitTextStroke: "1.5px #111111",
            textShadow: "0 1px 0 #111111",
          }}
        >
          {crossPaths.join("-")}
        </div>
      )}
    </div>
  );
}
