import { Event, Layout } from "@components";
import type { LeaderboardRow, LeaderboardType } from "./base.leaderboard";
import {
  EventType,
  ModifierImages,
  loadImage,
  msToTimeFormat
} from "@utils";

interface LeaderboardProfileProps {
  type: LeaderboardType;
  subtitle: string;
  scoringType: string;
  rows: LeaderboardRow[];
}

interface ScoreCell {
  value: string;
  icon?: string;
}

const CONTENTTOP = 4;

const FONT = {
  header: 22,
  position: 26,
  name: 24,
  score: 24,
  separator: 24,
} as const;

const MEDAL_SIZE = 37;
const SCORE_ICON_SIZE = 28;

const scoreColumnWidth = (count: number) =>
  count === 1 ? 158 : count === 2 ? 158 : 150;

function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

function isLeastScoring(scoringType: string): boolean {
  return scoringType === "LeastCash" || scoringType === "LeastTiers";
}

function formatScoreParts(
  type: LeaderboardType,
  scoringType: string,
  parts: { score: number; secondScore?: number | null; thirdScore?: number | null },
): ScoreCell[] {

  if (type === EventType.CT) {
    return [{ value: formatScore(parts.score) }];
  }

  if (type === EventType.Race) {
    return [
      { value: formatScore(parts.score) },
      { value: parts.secondScore != null ? msToTimeFormat(parts.secondScore) : "—" },
    ];
  }

  const tier: ScoreCell = {
    value: formatScore(parts.score),
    icon: ModifierImages.BossTier,
  };

  if (!isLeastScoring(scoringType)) {
    return [
      tier,
      { value: parts.secondScore != null ? msToTimeFormat(parts.secondScore) : "—" },
    ];
  }

  const metricIcon = scoringType === "LeastCash" ? ModifierImages.LeastCash : ModifierImages.LeastTiers;

  return [
    tier,
    {
      value: parts.secondScore != null ? formatScore(parts.secondScore) : "—",
      icon: metricIcon,
    },
    { value: parts.thirdScore != null ? msToTimeFormat(parts.thirdScore) : "—" },
  ];
}

function scoreHeaders(type: LeaderboardType, scoringType: string): string[] {
  if (type === EventType.CT) return ["Score"];
  if (type === EventType.Race) return ["Score", "Time"];

  return isLeastScoring(scoringType)
    ? ["Tier", scoringType === "LeastCash" ? "Cash" : "Tiers", "Time"]
    : ["Tier", "Time"];
}

const HeaderRow = ({
  headers,
  scoreColumnCount,
}: {
  headers: string[];
  scoreColumnCount: number;
}) => (
  <Layout.Box
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      padding: "8px 15px",
      width: "100%",
    }}
  >
    <div style={{ display: "flex", width: 45 }} />

    <div style={{ display: "flex", width: 68, justifyContent: "flex-end" }}>
      <span style={{ fontSize: FONT.header, color: "white", fontWeight: "bold", marginTop: CONTENTTOP }}>
        #
      </span>
    </div>

    <div style={{ display: "flex", flex: 1 }}>
      <span style={{ fontSize: FONT.header, color: "white", fontWeight: "bold", marginTop: CONTENTTOP }}>
        Team
      </span>
    </div>

    {headers.map((label, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          width: scoreColumnWidth(scoreColumnCount),
          justifyContent: "flex-start",
          marginTop: CONTENTTOP
        }}
      >
        <span style={{ fontSize: FONT.header, color: "white", fontWeight: "bold" }}>
          {label}
        </span>
      </div>
    ))}
  </Layout.Box>
);


interface RowProps {
  medal: string | null;
  position: number;
  members: { displayName: string; profile: string }[];
  scores: ScoreCell[];
  scoreColumnCount: number;
  highlighted: boolean;
}

const Row = ({
  medal,
  position,
  members,
  scores,
  scoreColumnCount,
  highlighted,
}: RowProps) => (
  <Layout.Box
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      padding: "6px 15px",
      width: "100%",
      ...(highlighted
        ? {
            borderRadius: 8,
            backgroundColor: "rgba(144, 202, 249, 0.15)",
            border: "1px solid rgba(144, 202, 249, 0.5)",
          }
        : {}),
    }}
  >
    <div
      style={{
        display: "flex",
        width: 45,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {medal ? (
        <img src={loadImage(medal)} width={MEDAL_SIZE} height={MEDAL_SIZE} />
      ) : (
        <div style={{ display: "flex", width: MEDAL_SIZE, height: MEDAL_SIZE }} />
      )}
    </div>
    <div style={{ display: "flex", width: 68, justifyContent: "flex-end" }}>
      <span
        style={{
          fontSize: FONT.position,
          color: highlighted ? "#90caf9" : "white",
          fontWeight: "bold",
          marginTop: CONTENTTOP
        }}
      >
        #{position}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        overflow: "hidden",
        gap: 8,
        marginTop: CONTENTTOP
      }}
    >
      {members.map((member, i) => (
        <div
          key={`${member.displayName}-${i}`}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: FONT.name,
              color: "white",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {member.displayName}
          </span>
          {i < members.length - 1 && (
            <span style={{ fontSize: FONT.separator, color: "#9aa4b2" }}>·</span>
          )}
        </div>
      ))}
    </div>

    {/* Score parts */}
    {scores.map((cell, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          width: scoreColumnWidth(scoreColumnCount),
          justifyContent: "flex-start",
        }}
      >
        {cell.icon && (
          <img
            src={loadImage(cell.icon)}
            width={SCORE_ICON_SIZE}
            height={SCORE_ICON_SIZE}
          />
        )}
        <span
          style={{
            fontSize: FONT.score,
            color: "white",
            fontWeight: i === 0 ? "bold" : "normal",
            marginTop: CONTENTTOP
          }}
        >
          {cell.value}
        </span>
      </div>
    ))}
  </Layout.Box>
);

export function LeaderboardProfile({
  type,
  subtitle,
  scoringType,
  rows,
}: LeaderboardProfileProps): JSX.Element {

  const headers = scoreHeaders(type, scoringType);
  const scoreColumnCount = headers.length;

  return (
    <Layout.Container>
      <Event.Header
        eventType={type}
        eventName={subtitle}
      />

      <HeaderRow headers={headers} scoreColumnCount={scoreColumnCount} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 5,
        }}
      >
        {rows.map((row, i) => (
          <Row
            key={`${row.position}-${i}`}
            medal={row.medal}
            position={row.position}
            members={row.members}
            scores={formatScoreParts(type, scoringType, row.scoreParts)}
            scoreColumnCount={scoreColumnCount}
            highlighted={row.highlighted}
          />
        ))}
      </div>
    </Layout.Container>
  );
}
