import { JSX, ReactNode } from "react";
import { 
  loadImage, 
  Images, 
  BossBody, 
  MetaBody,
  splitUppercase,
  BossDifficulty
} from "@utils";
import { Container, Header } from "@components";

export interface BossProfileProps {
    event: BossBody;
    metaData: MetaBody;
    difficulty: BossDifficulty;
}

export function BossProfile({
  event,
  metaData,
  difficulty,
}: BossProfileProps): JSX.Element {

  const mapPath = Images.Maps[metaData.map as keyof typeof Images.Maps];
  const mapImage = mapPath ? loadImage(mapPath) : undefined;

  const infoItems = [
    { label: "Difficulty", value: String(metaData.difficulty) },
    { label: "Mode", value: String(metaData.mode) },
    { label: "Starting Cash", value: String(metaData.startingCash) },
    { label: "Starting Lives", value: String(metaData.lives) },
    { label: "Start Round", value: String(metaData.startRound) },
    { label: "End Round", value: String(metaData.endRound) },
  ];

  return (
    <Container background="#0e3f78">
      <Header mode="Boss" name={event.name} badge={difficulty} />
    </Container>
  );
}
