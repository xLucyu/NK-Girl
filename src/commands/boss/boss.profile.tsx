import {
  BossBody,
  MetaBody,
  BossDifficulty,
  BossImages,
  splitUppercase,
} from "@utils";
import { Layout, Event } from "@components";

interface BossProfileProps {
  event: BossBody;
  metaData: MetaBody;
  difficulty: BossDifficulty;
}

const capitalize = (value: string): string => {
  if (!value) return "";
  return value[0].toUpperCase() + value.slice(1);
};

export function BossProfile({
  event,
  metaData,
  difficulty,
}: BossProfileProps): JSX.Element {
  const bossTypeKey = capitalize(event.bossType) as keyof typeof BossImages;
  const bossIcon = BossImages[bossTypeKey]?.[difficulty];

  const scoreType =
    difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;

  const infoItems = [
    { label: "Difficulty", value: metaData.difficulty },
    { label: "Mode", value: metaData.mode },
    { label: "Starting Cash", value: metaData.startingCash },
    { label: "Starting Lives", value: metaData.lives },
    { label: "Start Round", value: metaData.startRound },
    { label: "End Round", value: metaData.endRound },
    { label: "Scoring Type", value: splitUppercase(scoreType) },
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType="Boss"
        eventName={splitUppercase(event.name)}
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
        <Event.Modifiers metaData={metaData} />
        <Layout.Column>
          <Event.Towers towers={metaData._towers ?? []} />
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}
