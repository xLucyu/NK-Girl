import { Event, Layout } from "@components";
import { 
  Boss,
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

const subGameType: Record<number, string> = {
  2: "Race",
  4: "Boss",
  8: "LeastTiers",
  9: "LeastCash"
}

const bossType: Record<number, Boss> = {
  0: Boss.Bloonarius,
  1: Boss.Lych,
  2: Boss.Vortex,
  3: Boss.Dreadbloon,
  4: Boss.Phayze,
  5: Boss.Blastapopoulos,
  6: Boss.Diamondback
}

const getTitle = (tile: TileCode): string => {
  if (tile.GameData.bossData) return `${bossType[tile.GameData.bossData.bossBloon]} ${tile.GameData.bossData.TierCount} Tier`;
  return splitUppercase(subGameType[tile.GameData.subGameType]);
}

const getEndRound = (tile: TileCode): number => {
  if (tile.GameData.bossData) return tile.GameData.bossData.TierCount * 20 + 20;
  return tile.GameData.dcModel.startRules.endRound;
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
    { label: "End Round", value: getEndRound(tile), image: EventImages.StartRound }
  ];

  return (
  <Layout.Container>
    <Event.Header
      eventType={EventType.CT}
      eventName={`Contested Territory #${ctNumber}`}
      difficulty={getTitle(tile)}
    />
    <Layout.Row style={{ alignItems: "stretch", height: 300 }}>
      <Layout.Box style={{ flex: 1}}>
        <Event.Map
          map={tile.GameData.selectedMap}
          iconPath={ctIcon}
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
            <Event.Towers towers={getTowers(tile.GameData.dcModel.towers._items ?? [])} />
          </Layout.Column>
      </Layout.Row>
  </Layout.Container>
  )
}
