import { 
  BossBody, 
  BossDifficulty, 
  ModifierImages, 
  MetaBody, 
  BossImages, 
  buildModifiers, 
  EventImages, 
  filterModifiers, 
  getTowers, 
  ScoringType, 
  splitBossNumbers, 
  splitUppercase 
} from "@btd6";
import { capitalize } from "@lib";
import { Event, Layout } from "@ui";


interface BossProfileProps {
  event: BossBody;
  metaData: MetaBody;
  difficulty: BossDifficulty;
}

const scoreTypeImage: Record<ScoringType, string> = {
  [ScoringType.GameTime]: EventImages.Race,
  [ScoringType.LeastCash]: ModifierImages.LeastCash,
  [ScoringType.LeastTiers]: ModifierImages.LeastTiers,
  [ScoringType.CTPoints]: ""
}

const hasCustomRounds = (metaData: MetaBody, event: BossBody) => {
  return metaData.roundSets.some((set) => set.name !== event.bossType)
}

export function BossProfile({ event, metaData, difficulty }: BossProfileProps): JSX.Element {
  
  const bossTypeKey = capitalize(event.bossType) as keyof typeof BossImages;
  const bossIcon = BossImages[bossTypeKey]?.[difficulty];
  const customRounds = hasCustomRounds(metaData, event);

  const modifiers = filterModifiers(buildModifiers(metaData, customRounds));

  const scoreType = difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;

  const infoItems = [
    { label: "Difficulty", value: metaData.difficulty },
    { label: "Mode", value: splitUppercase(metaData.mode) },
    { label: "Starting Cash", value: metaData.startingCash, image: EventImages.Cash },
    { label: "Starting Lives", value: metaData.lives, image: EventImages.Lives },
    { label: "Start Round", value: metaData.startRound, image: EventImages.StartRound },
    { label: "End Round", value: metaData.endRound, image: EventImages.StartRound },
    { label: "Scoring Type", value: splitUppercase(scoreType), image: scoreTypeImage[scoreType] },
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType="Boss"
        eventName={splitBossNumbers(event.name)}
        difficulty={difficulty}
      />
      <Layout.Row>
        <Layout.Box style={{ flex: 1 }}>
        <Event.Map
          map={metaData.map}
          iconPath={bossIcon}
        />
        </Layout.Box>
        <Layout.Column style={{ flex: 1 }}>
          <Event.Info items={infoItems} />
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
