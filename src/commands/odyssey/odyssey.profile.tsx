import { 
    EventImages,
    EventType,
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

export interface OdysseyProfileProps {
    event: OdysseyBody;
    metaData: OdysseyMetaData & { mapsData: MetaBody[] };
    difficulty: OdysseyDifficulty;
}

function getMapSize(mapCount: number): number {
  if (mapCount <= 3) return 220;
  if (mapCount === 4) return 170;
  return 140;
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

function mapInfoItems(map: MetaBody) {
  return [
    { label: "Difficulty", value: splitUppercase(map.difficulty) },
    { label: "Mode", value: splitUppercase(map.mode) },
  ];
}

export function OdysseyProfile({ event, metaData, difficulty }: OdysseyProfileProps): JSX.Element {

  const odysseyImage = OdysseyImages[difficulty];
  const odysseyEventNumber = getNumberForEvent(event.start, EventType.Odyssey);
  const mapSize = getMapSize(metaData.mapsData.length);

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
        <Event.Info items={infoItems} />
        <Event.Bar start={event.start} end={event.end} />
      </Layout.Row>
      <Layout.Row>
        <Event.Towers towers={getTowers(metaData._availableTowers ?? [])} />
      </Layout.Row>
      <Layout.Row>
        {metaData.mapsData.map((map, i) => (
          <Layout.Column key={i}>
            <Event.Map
              map={map.map}
              width={mapSize}
              height={Math.round(mapSize * 0.63)}
            />
            <Event.Info items={mapInfoItems(map)} />
          </Layout.Column>
        ))}
      </Layout.Row>
    </Layout.Container>
  );
}
