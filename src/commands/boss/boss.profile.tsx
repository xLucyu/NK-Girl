import {
  BossBody,
  MetaBody,
  BossDifficulty,
  BossImages,
  splitUppercase,
  splitBossNumbers,
  getTowers,
  filterModifiers,
  buildModifiers,
  EventImages,
  ModifierImages,
} from "@utils";
import { Layout, Event } from "@components";
import { ScoringType } from "@manager";

interface BossProfileProps {
  event: BossBody;
  metaData: MetaBody;
  difficulty: BossDifficulty;
}

const scoreTypeImage: Record<ScoringType, string> = {
  [ScoringType.GameTime]: EventImages.Race,
  [ScoringType.LeastCash]: ModifierImages.LeastCash,
  [ScoringType.LeastTiers]: ModifierImages.LeastTiers
}

const capitalize = (value: string): string => {
  return value[0].toUpperCase() + value.slice(1);
};

export function BossProfile({ event, metaData, difficulty }: BossProfileProps): JSX.Element {
  
  const bossTypeKey = capitalize(event.bossType) as keyof typeof BossImages;
  const bossIcon = BossImages[bossTypeKey]?.[difficulty];

  const modifiers = filterModifiers(buildModifiers(metaData));

  const scoreType = difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;

  const infoItems = [
    { label: "Difficulty", value: metaData.difficulty },
    { label: "Mode", value: metaData.mode },
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
        <Event.Map
          map={metaData.map}
          iconPath={bossIcon}
          width={480}
          height={302}
        />
        <Layout.Column>
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