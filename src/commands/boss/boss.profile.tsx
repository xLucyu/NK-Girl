import { loadImage } from "@utils/assets/images/loadImage";
import { BossDifficulty } from "@manager/cache";
import { Images } from "@utils/assets/images";
import { BossBody, MetaBody } from "@utils/types";
import { JSX } from "react";

export interface BossProfileProps {
    event: BossBody;
    metaData: MetaBody;
    difficulty: BossDifficulty;
}

export function BossProfile({ event, metaData, difficulty }: BossProfileProps): JSX.Element {
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 40,
        backgroundColor: "white",
      }}
    >
      <h1>{event.name}</h1>
      <p>Difficulty: {difficulty}</p>
      <p>Starting Cash: {metaData.startingCash}</p>
      <p>Lives: {metaData.lives}</p>
      <img src={loadImage(Images.Boss.Bloonarius.Banner)} width={300} height={100} />
    </div>
  );
}
