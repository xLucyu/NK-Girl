import { Event, Layout, Options } from "@components";
import { 
  Boss, 
  BossBody, 
  BossDifficulty, 
  BossImages, 
  calcBossHp, 
  MetaBody, 
  splitBossNumbers 
} from "@utils";

interface BossDetailsProfileProps {
  event: BossBody;
  metaData: MetaBody;
  options: Options;
}

export function BossDetailsProfile({ event, metaData, options }: BossDetailsProfileProps): JSX.Element {

  const difficulty = options.difficulty as BossDifficulty;
  const boss = (options.boss ?? event.bossType) as Boss;
  const playerCount = Number(options.playerCount);
  const hpModifier = Number(options.hpModifier ?? metaData._bloonModifiers.healthMultipliers.boss ?? 1);

  const tiers = calcBossHp(boss, hpModifier, playerCount, difficulty);

  const infoItems = [
    { label: "Boss", value: boss },
    { label: "Players", value: `${playerCount}` },
    { label: "HP Modifier", value: `${hpModifier}x` },
  ];

 return (
    <Layout.Container>
      <Event.Header
        eventType="Boss"
        eventName={splitBossNumbers(event.name)}
        difficulty={difficulty}
      />
      <Event.Info items={infoItems} />

      <Layout.Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 6,
          padding: 12,
          width: "100%",
        }}
      >
        {tiers.map((tier) => (
          <Layout.Box
            key={tier.tier}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              padding: 8,
              width: "100%",
            }}
          >
            <span style={{ fontSize: 42, color: "white" }}>Tier {tier.tier}</span>
            <span style={{ fontSize: 32, color: "white" }}>Skull HP: {tier.skullHp}</span>
            <span style={{ fontSize: 32, color: "white" }}>Total: {tier.totalHp}</span>
          </Layout.Box>
        ))}
      </Layout.Box>
      )
    </Layout.Container>
  );
}
