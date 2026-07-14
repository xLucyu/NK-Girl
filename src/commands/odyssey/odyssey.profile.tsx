import { 
    buildModifiers,
    EventImages,
    EventType,
    filterModifiers,
    getNumberForEvent,
    getTowers,
    MetaBody, 
    ModifierImages, 
    OdysseyBody, 
    OdysseyDifficulty, 
    OdysseyImages, 
    OdysseyMetaData, 
    splitUppercase
} from "@utils";
import { Event, Layout } from "@components";

const MapDisplay = ({ map, size }: { map: MetaBody; size: number }) => {
  const modifiers = filterModifiers(buildModifiers(map));
  const isSmall = size <= 140;
  const nameFontSize = isSmall ? 16 : 22;
  const metaFontSize = isSmall ? 12 : 14;
  const roundFontSize = isSmall ? 13 : 15;

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
      <Event.Map map={map.map} height={size} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <span style={{ fontSize: nameFontSize, color: "white" }}>
          {splitUppercase(map.map)}
        </span>
        <span style={{ fontSize: metaFontSize, color: "#aaa" }}>
          {`${map.difficulty} - ${splitUppercase(map.mode)}`}
        </span>
        <span style={{ fontSize: roundFontSize, color: "white" }}>
          {`R${map.startRound} - R${map.endRound}`}
        </span>
      </div>

      {modifiers.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Event.Modifiers modifiers={modifiers} compact />
        </div>
      )}
    </Layout.Box>
  );
};




function getMapSize(mapCount: number): number {
  if (mapCount <= 3) return 180;
  if (mapCount === 4) return 140;
  return 110;
}



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
          <Event.Towers towers={getTowers(metaData._availableTowers ?? [])} />
       </Layout.Column>
      </Layout.Row>
      <Layout.Row style={{ flex: 1, width: "100%" }}>
        {metaData.mapsData.map((map, index) => (
          <div
          key={index}
          style={{ display: "flex", flex: 1, minWidth: 0 }}
          >
            <MapDisplay map={map} size={getMapSize(metaData.mapsData.length)} />
          </div>
          ))}
      </Layout.Row>
    </Layout.Container>
  );
}
