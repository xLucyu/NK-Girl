import { 
  EventType, 
  MetaBody, 
  EventImages, 
  RaceBody, 
  buildModifiers, 
  convertCash, 
  filterModifiers, 
  getNumberForEvent, 
  getTowers, 
  splitUppercase 
} from "@btd6";
import { Event, Layout } from "@ui";


export interface RaceProfileProps {
  event: RaceBody;
  metaData: MetaBody;
}

export function RaceProfile({ event, metaData }: RaceProfileProps): JSX.Element {

  const raceIcon = EventImages.Race;
  const hasCustomRounds = metaData.roundSets.length > 1;
  const modifiers = filterModifiers(buildModifiers(metaData, hasCustomRounds));

  const raceNumber = getNumberForEvent(event.start, EventType.Race)

  const infoItems = [
    { label: "Difficulty", value: metaData.difficulty },
    { label: "Mode", value: splitUppercase(metaData.mode) },
    { label: "Starting Cash", value: convertCash(metaData.startingCash), image: EventImages.Cash },
    { label: "Starting Lives", value: metaData.lives, image: EventImages.Lives },
    { label: "Start Round", value: metaData.startRound, image: EventImages.StartRound },
    { label: "End Round", value: metaData.endRound, image: EventImages.StartRound }
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType={`${EventType.Race} #${raceNumber}`}
        eventName={splitUppercase(event.name)}
      />
      <Layout.Row style={{ alignItems: "stretch", height: 300 }}>
        <Layout.Box style={{ flex: 1 }}>
        <Event.Map
          map={metaData.map}
          iconPath={raceIcon}
        />
        </Layout.Box>
        <Layout.Column flex={1}>
          <Layout.Fit>
          <Event.Info items={infoItems} />
          </Layout.Fit>
          <Event.Bar start={event.start} end={event.end} />
        </Layout.Column>
      </Layout.Row>
      <Layout.Row>
        <Event.Modifiers modifiers={modifiers} />
        <Layout.Column>
          <Event.Towers towers={getTowers(metaData._towers ?? [])} />
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}
