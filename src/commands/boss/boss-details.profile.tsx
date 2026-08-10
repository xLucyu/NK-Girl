import { Event, Layout } from "@components";
import {
  BossBody,
  BossImages,
  MetaBody,
  ModifierImages,
  Boss,
  BossDifficulty,
  splitBossNumbers,
  calcBossHp,
  loadImage,
  capitalize,
} from "@utils";
import type { BossDetailsOptions } from "./boss-details.command";

interface BossDetailsProfileProps {
  event: BossBody;
  metaData: MetaBody;
  options: BossDetailsOptions;
}

interface StatProps {
  label: string;
  value: number;
}

type Tier = ReturnType<typeof calcBossHp>["tiers"][number];

const Stat = ({ label, value }: StatProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
        marginTop: 6
      }}
    >
      <span style={{ fontSize: 28, color: "white" }}>
        {label}:
      </span>
      <span style={{ fontSize: 28, color: "white", fontWeight: "bold" }}>
        {value.toLocaleString("en-US")}
      </span>
    </div>
  );
};

const TierCard = ({ tier }: { tier: Tier }) => {
  return (
    <Layout.Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 16,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          width: 140,
        }}
      >
        <img src={loadImage(ModifierImages.BossTier)} width={40} height={40} />
        <span style={{ fontSize: 28, color: "white", fontWeight: "bold", letterSpacing: 1, marginTop: 6 }}>
          TIER {tier.tier}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          gap: 10,
        }}
      >
        <Stat label="Total" value={tier.totalHealth} />
        <Stat label="Base" value={Math.round(tier.baseHealth)} />
        {tier.withShield > 0 ? (
          <Stat label="Shield" value={tier.withShield} />
        ) : (
          <div style={{ display: "flex", flex: 1 }} />
        )}
      </div>
    </Layout.Box>
  );
};

export function BossDetailsProfile({ event, metaData, options }: BossDetailsProfileProps): JSX.Element {

  const difficulty = options.difficulty as BossDifficulty;
  const boss = capitalize((options.boss ?? event.bossType)) as Boss;
  const playerCount = Number(options.playerCount ?? 1);
  const hpModifier = Number(options.hpModifier ?? metaData._bloonModifiers.healthMultipliers.boss ?? 1);

  const { skullCount, tiers } = calcBossHp(boss, hpModifier, playerCount, difficulty);
  const bannerPath = BossImages[boss]?.Banner;

  const infoItems = [
    { label: "Boss", value: boss },
    { label: "Players", value: `${playerCount}` },
    { label: "HP Modifier", value: `${hpModifier*100}%` },
    { label: "Skulls", value: `${skullCount}` },
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType="Boss"
        eventName={options.boss ?? splitBossNumbers(event.name)}
        difficulty={difficulty}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <Event.Info items={infoItems} />
        </div>
        {bannerPath && (
          <Layout.Box
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}
          >
            <img
              src={loadImage(bannerPath)}
              width={550}
              height={170}
              style={{ objectFit: "contain" }}
            />
          </Layout.Box>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 8,
        }}
      >
        {tiers.map((tier) => (
          <TierCard key={tier.tier} tier={tier} />
        ))}
      </div>
    </Layout.Container>
  );
}
