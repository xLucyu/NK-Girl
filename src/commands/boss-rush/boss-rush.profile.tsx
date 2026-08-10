import {
  Event,
  Layout,
} from "@components";
import {
  BossImages,
  CATEGORIES,
  EventType,
  RelicImages,
  TowerContainers,
  TowerImages,
  getNumberForEvent,
  loadImage,
  splitUppercase,
  type BossRushResult,
  type EventBody,
} from "@utils";

interface BossRushProfileProps {
  event: EventBody;
  metaData: BossRushResult;
}

type BossRushStage =
  BossRushResult["stages"][number];

type TowerCategory =
  keyof typeof CATEGORIES;

const TOWER_SIZE = 42;
const RELIC_SIZE = 36;

const CATEGORY_LOOKUP: Record<
  string,
  TowerCategory
> = (() => {

  const result: Record<
    string,
    TowerCategory
  > = {};

  for (
    const [category, towers]
    of Object.entries(CATEGORIES) as [
      TowerCategory,
      string[],
    ][]
  ) {
    for (const tower of towers) {
      result[tower] = category;
    }
  }

  return result;
})();

function getBossIcon(
  boss: string,
): string | undefined {

  const images =
    BossImages[
      boss as keyof typeof BossImages
    ];

  return images?.Standard;
}

interface TowerTileProps {
  tower: string;
  removed?: boolean;
}

function TowerTile({
  tower,
  removed = false,
}: TowerTileProps): JSX.Element | null {

  const category =
    CATEGORY_LOOKUP[tower];

  if (!category) return null;

  const backgroundPath =
    TowerContainers[category];

  const towerPath =
    TowerImages[
      tower as keyof typeof TowerImages
    ];

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: TOWER_SIZE,
        height: TOWER_SIZE,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        opacity: removed ? 0.8 : 1,
      }}
    >
      <img
        src={loadImage(backgroundPath)}
        width={TOWER_SIZE}
        height={TOWER_SIZE}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 7,
        }}
      />

      {towerPath ? (
        <img
          src={loadImage(towerPath)}
          width={TOWER_SIZE}
          height={TOWER_SIZE}
          style={{
            position: "relative",
            objectFit: "contain",
            borderRadius: 7,
          }}
        />
      ) : (
        <span
          style={{
            position: "relative",
            color: "white",
            fontSize: 20,
          }}
        >
          ?
        </span>
      )}

      {removed ? (
        <BlockedBadge />
      ) : null}
    </div>
  );
}

function BlockedBadge(): JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: -4,
        left: -4,
        width: 20,
        height: 20,
        border: "4px solid #ff4a16",
        borderRadius: "50%",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          "rgba(30, 20, 20, 0.45)",
        filter:
          "drop-shadow(0 1px 1px #000)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 14,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#ff4a16",
          transform: "rotate(-45deg)",
        }}
      />
    </div>
  );
}

interface RelicTileProps {
  relic: string;
  isNew: boolean;
}

function RelicTile({
  relic,
  isNew,
}: RelicTileProps): JSX.Element | null {

  const imagePath =
    RelicImages[
      relic as keyof typeof RelicImages
    ];

  if (!imagePath) return null;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: RELIC_SIZE,
        height: RELIC_SIZE,
        flexShrink: 0,
      }}
    >
      <img
        src={loadImage(imagePath)}
        width={RELIC_SIZE}
        height={RELIC_SIZE}
        style={{
          objectFit: "contain",
          filter:
            "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.7))",
        }}
      />

      {isNew ? (
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: -7,
            right: -7,
            padding: "2px 4px",
            borderRadius: 4,
            backgroundColor: "#f4f5fa",
            color: "#20324d",
            border: "1px solid #9ba9bd",
            fontSize: 8,
            lineHeight: 1,
            transform: "rotate(-12deg)",
          }}
        >
          NEW
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: string;
}): JSX.Element {

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        color: "white",
        fontSize: 17,
        textTransform: "uppercase",
        lineHeight: 1,
        textShadow:
          "-1px -1px 0 #111, 1px -1px 0 #111, -1px 1px 0 #111, 1px 1px 0 #111",
      }}
    >
      {children}
    </div>
  );
}

interface StageCardProps {
  stage: BossRushStage;
  hero: string | null;
}

function StageCard({
  stage,
}: StageCardProps): JSX.Element {

  const bossIcon = getBossIcon(stage.boss);

  return (
    <Layout.Box
      style={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        padding: 8,
        gap: 8,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      <Event.Map
        map={stage.map}
        height={116}
        iconPath={bossIcon}
      />

      <SectionTitle>
        Available Towers
      </SectionTitle>

      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: 183,
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {stage.towers.map((tower, index) => (
          <TowerTile
            key={`available-${tower}-${index}`}
            tower={tower}
          />
        ))}

        {stage.removed.map((tower, index) => (
          <TowerTile
            key={`removed-${tower}-${index}`}
            tower={tower}
            removed
          />
        ))}
      </div>

      <SectionTitle>
        Relics
      </SectionTitle>

      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: RELIC_SIZE,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        {stage.relics.map((relic, index) => (
          <RelicTile
            key={`${relic}-${index}`}
            relic={relic}
            isNew={stage.newRelic === relic}
          />
        ))}
      </div>
    </Layout.Box>
  );
}

export function BossRushProfile({
  event,
  metaData,
}: BossRushProfileProps): JSX.Element {

  console.log(getNumberForEvent(event.start, EventType.BossRush));
  return (
    <Layout.Container>
      <Event.Header
        eventType={splitUppercase(
          EventType.BossRush,
        )}
        eventName={event.name}
      />

      <Event.Bar
        start={event.start}
        end={event.end}
      />

      <Layout.Row
        gap={8}
        style={{
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        {metaData.stages.map(
          (stage) => (
            <StageCard
              key={stage.stage}
              stage={stage}
              hero={metaData.hero}
            />
          ),
        )}
      </Layout.Row>
    </Layout.Container>
  );
}
