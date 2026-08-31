import { 
  BossImages, 
  BossRushResult, 
  EventBody, 
  EventType, 
  RelicImages, 
  getNumberForEvent, 
  splitUppercase 
} from "@btd6";
import { Event, Layout, loadImage } from "@ui";

interface BossRushProfileProps {
  event: EventBody;
  metaData: BossRushResult;
}

type BossRushStage = BossRushResult["stages"][number];

const TOWER_SIZE = 42;
const RELIC_SIZE = 38;

interface RelicTileProps {
  relic: string;
  isNew: boolean;
}

interface StageCardProps {
  stage: BossRushStage;
  hero: string | null;
}

function RelicTile({
  relic,
  isNew,
}: RelicTileProps): JSX.Element | null {

  const imagePath = RelicImages[relic as keyof typeof RelicImages];
  
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

function SectionTitle({children}: { children: string }): JSX.Element {

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

function StageCard({stage}: StageCardProps): JSX.Element {

  const bossIcon = BossImages[stage.boss as keyof typeof BossImages].Standard;

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
        overlay={
          <img
            src={loadImage(bossIcon)}
            width={70}
            height={70}
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              objectFit: "contain"
            }}
            />
        }
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
          <Event.TowerIcon
            key={`available-${tower}-${index}`}
            towerName={tower}
            size={TOWER_SIZE}
          />
        ))}

        {stage.removed.map((tower, index) => (
          <Event.TowerIcon
            key={`removed-${tower}-${index}`}
            towerName={tower}
            size={TOWER_SIZE}
            blocked
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

export function BossRushProfile({ event, metaData }: BossRushProfileProps): JSX.Element {

  return (
    <Layout.Container>
      <Event.Header
        eventType={splitUppercase(EventType.BossRush)}
        eventName={`${EventType.BossRush} #${getNumberForEvent(event.start, EventType.BossRush)}`}
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
