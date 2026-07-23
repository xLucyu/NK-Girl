import { Event, Layout } from "@components";
import { 
  buildCTModifiers, 
  convertCash, 
  CTBody, 
  EventImages, 
  EventType, 
  filterModifiers, 
  getTowers, 
  splitUppercase, 
  TileCode 
} from "@utils"

interface CtProps {
  event: CTBody;
  tile: TileCode;
}

const liveCount: Record<string, number> = {
  "Easy": 200,
  "Medium": 150,
  "Hard": 100
}

export function TileProfile({ event, tile }: CtProps): JSX.Element {

  const ctNumber = tile.EventNumber;
  const ctIcon = EventImages.CT;
  const modifiers = filterModifiers(buildCTModifiers(tile.GameData));

  const infoItems = [
    { label: "Difficulty", value: tile.GameData.selectedDifficulty },
    { label: "Mode", value: splitUppercase(tile.GameData.selectedMode) },
    { label: "Starting Cash", value: convertCash(tile.GameData.dcModel.startRules.cash), image: EventImages.Cash },
    { label: "Starting Lives", value: liveCount[tile.GameData.selectedDifficulty], image: EventImages.Lives },
    { label: "Start Round", value: tile.GameData.dcModel.startRules.round, image: EventImages.StartRound },
    { label: "End Round", value: tile.GameData.dcModel.startRules.endRound, image: EventImages.StartRound }
  ];

  return (
  <Layout.Container>
    <Event.Header
      eventType={EventType.CT}
      eventName={`Contested Territory #${ctNumber}`}
    />
    <Layout.Row>
      <Layout.Box style={{ flex: 1 }}>
        <Event.Map
          map={tile.GameData.selectedMap}
          iconPath={ctIcon}
        />
      </Layout.Box>
      <Layout.Column flex={1}>
        <Event.Info items={infoItems} />
        <Event.Bar start={event.start} end={event.end} />
      </Layout.Column>
    </Layout.Row>
      <Layout.Row>
        <Event.Modifiers modifiers={modifiers} />
          <Layout.Column>
            <Event.Towers towers={getTowers(tile.GameData.dcModel.towers._items ?? [])} />
          </Layout.Column>
      </Layout.Row>
  </Layout.Container>
  )
}
