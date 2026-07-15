import { 
    buildModifiers,
    convertCash,
    EventImages,
    EventType,
    filterModifiers,
    getNumberForEvent,
    getTowers,
    loadImage,
    MetaBody, 
    ModifierImages, 
    type OdysseyBody, 
    OdysseyDifficulty, 
    OdysseyImages, 
    type OdysseyMetaData, 
    splitUppercase
} from "@utils";
import { Event, Layout } from "@components";

const MapDisplay = ({ map, size }: { map: MetaBody; size: number }) => {

  const modifiers = filterModifiers(buildModifiers(map));

  return (
    <Layout.Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: 12,
        width: "100%",
      }}
    >
      <Event.Map
        map={map.map}
        height={size}
        overlay={
          modifiers.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                padding: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  width: "100%",
                  alignItems: "center",
                  height: "100%",
                  padding: 4,
                }}
              >
                <Event.Modifiers modifiers={modifiers} compact />
              </div>
            </div>
          ) : null
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <span style={{ fontSize: 20, color: "white" }}>
          {splitUppercase(map.map)}
        </span>
        <span style={{ fontSize: 14, color: "white" }}>
          {`${map.difficulty} - ${splitUppercase(map.mode)}`}
        </span>
        <span style={{ fontSize: 15, color: "white" }}>
          {`R${map.startRound} - R${map.endRound}`}
        </span>
        <span style={{ fontSize: 14, color: "white" }}>
          {`${loadImage(EventImages.Cash)} ${convertCash(map.startingCash)}`}
        </span>
      </div>
    </Layout.Box>
  );
};


export interface OdysseyProfileProps {
  event: OdysseyBody;
  metaData: OdysseyMetaData & { mapsData: MetaBody[] };
  difficulty: OdysseyDifficulty;
}

const reward = (metaData: OdysseyMetaData & { mapsData: MetaBody[] }): string => {

  const importantReward = metaData._rewards[metaData._rewards.length - 1];
  const [rewardType, rewardValue] = importantReward.split(":");

  if (rewardType === "InstaMonkey") {
    const [name, tier] = rewardValue.split(",");
    return `${splitUppercase(name)} (${tier})`;
  }

  if (rewardType === "CollectionEvent") {
    return `${rewardValue} Totems`;
  }

  return splitUppercase(rewardValue);
}

const formatDifficulty = (isExtreme: boolean, difficulty: OdysseyDifficulty): string => {
  return `${difficulty}${isExtreme ? ", Extreme" : ""}`
}

export function OdysseyProfile({ event, metaData, difficulty }: OdysseyProfileProps): JSX.Element {

  const odysseyImage = OdysseyImages[difficulty];
  const odysseyEventNumber = getNumberForEvent(event.start, EventType.Odyssey);

  const infoItems = [
    { label: "Difficulty", value: formatDifficulty(metaData.isExtreme, difficulty), image: odysseyImage },
    { label: "Lives", value: metaData.startingHealth, image: EventImages.Lives },
    { label: "Max Seats", value: metaData.maxMonkeySeats },
    { label: "Max Monkeys", value: metaData.maxMonkeysOnBoat, image: ModifierImages.MaxTowers },
    { label: "Reward", value: reward(metaData) }
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType={`${EventType.Odyssey} #${odysseyEventNumber}`}
        eventName={splitUppercase(event.name)}
        difficulty={difficulty}
      />
      <Layout.Row>
        <Layout.Column>
          <Event.Info items={infoItems} />
          <Event.Bar start={event.start} end={event.end} />
        </Layout.Column>
        <Layout.Column>
          <Event.Towers towers={getTowers(metaData._availableTowers ?? [])} compact/>
       </Layout.Column>
      </Layout.Row>
      <Layout.Row style={{ flex: 1, justifyContent: "flex-start", gap: 12}}>
        {metaData.mapsData.map((map, index) => (
          <div
            key={index}
            style={{ display: "flex", width: 221, flexShrink: 0 }}
          >
            <MapDisplay map={map} size={160} />
          </div>
        ))}
      </Layout.Row>
    </Layout.Container>
  );
}
