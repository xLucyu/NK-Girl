import { 
  buildModifiers, 
  convertCash, 
  DailyChallenge, 
  DailyChallengeDifficulty, 
  EventImages, 
  EventType, 
  filterModifiers,  
  getTowers,  
  MetaBody, 
  splitUppercase 
} from "@btd6";
import { Event, Layout } from "@ui";

export interface ChallengeProfileProps {
  event?: DailyChallenge;
  difficulty?: DailyChallengeDifficulty;
  code?: string;
  metaData: MetaBody;
}

export function ChallengeProfile({ event, difficulty, code, metaData }: ChallengeProfileProps): JSX.Element {

  const challengeIcon = EventImages.CT;
  const hasCustomRounds = metaData.roundSets.length > 1;
  const modifiers = filterModifiers(buildModifiers(metaData, hasCustomRounds));

  const creator = metaData.name.replace(/'s Challenge$/, "");
  const title = event ? `${difficulty} Challenge #${event.number} by ${creator}` : `Challenge by ${creator} - ${code}`;

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
        eventType={EventType.Challenge}
        eventName={title}
      />
      <Layout.Row style={{ alignItems: "stretch", height: 300 }}>
        <Layout.Box style={{ flex: 1 }}>
        <Event.Map
          map={metaData.map}
          iconPath={challengeIcon}
        />
        </Layout.Box>
        <Layout.Column flex={1}>
          <Layout.Fit>
          <Event.Info items={infoItems} />
          </Layout.Fit>
          <Event.Bar start={0} end={0} />
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