import { Event, Layout } from "@components";
import { BaseLeaderboard } from "./base.leaderboard";
import {
  EventImages,
  EventType,
  LeaderboardPayload,
  MedalsMode,
  ModifierImages,
  loadImage,
} from "@utils";
import type { LeaderboardType } from "./base.leaderboard";

interface LeaderboardProfileProps {
  data: LeaderboardPayload;
  type: LeaderboardType;
  subtitle: string;
  medalsMode: MedalsMode;
  page: number;
  pageSize: number;
}

interface ScoreCell {
  value: string;
  icon?: string;
}

// ── Formatting helpers ────────────────────────────────────────────────────────

/** Format a plain numeric score (comma-separated for readability). */
function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format a duration expressed in milliseconds → "H:MM:SS.mmm" or "M:SS.mmm". */
function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const hours   = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  const millis  = ms % 1000;

  const mm  = String(minutes).padStart(2, "0");
  const ss  = String(seconds).padStart(2, "0");
  const mmm = String(millis).padStart(3, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}.${mmm}` : `${minutes}:${ss}.${mmm}`;
}

/**
 * Build the score cells for a team based on event type and scoring type.
 * Column count returned here MUST match scoreHeaders() below.
 */
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
      { value: parts.secondScore != null ? formatDuration(parts.secondScore) : "—" },
    ];
  }

  // Boss
  const isLeast = scoringType === "LeastCash" || scoringType === "LeastTiers";
  if (isLeast) {
    const scoreIcon =
      scoringType === "LeastCash"  ? EventImages.Lives :
      scoringType === "LeastTiers" ? EventImages.Lives : undefined;

    return [
      { value: formatScore(parts.score),                                            icon: ModifierImages.BossTier },
      { value: parts.secondScore != null ? formatScore(parts.secondScore) : "—",    icon: scoreIcon },
      { value: parts.thirdScore  != null ? formatDuration(parts.thirdScore) : "—" },
    ];
  }
  // Boss Timed
  return [{ value: formatDuration(parts.score) }];
}

function scoreHeaders(type: LeaderboardType, scoringType: string): string[] {
  if (type === EventType.CT)   return ["Score"];
  if (type === EventType.Race) return ["Score", "Time"];
  const isLeast = scoringType === "LeastCash" || scoringType === "LeastTiers";
  return isLeast ? ["Tier", "Score", "Time"] : ["Time"];
}

// ── Shared column-width helper ────────────────────────────────────────────────

function scoreColumnWidth(count: number): number {
  if (count === 1) return 160;
  if (count === 2) return 160;
  return 140;
}

// ── Header row ────────────────────────────────────────────────────────────────

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
      gap: 16,
      padding: "8px 14px",
      width: "100%",
    }}
  >
    {/* Medal spacer */}
    <div style={{ display: "flex", width: 40 }} />

    {/* # */}
    <div style={{ display: "flex", width: 60, justifyContent: "flex-end" }}>
      <span style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>#</span>
    </div>

    {/* Team */}
    <div style={{ display: "flex", flex: 1 }}>
      <span style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>Team</span>
    </div>

    {/* Score column headers */}
    {headers.map((label, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          width: scoreColumnWidth(scoreColumnCount),
          justifyContent: "flex-start",
        }}
      >
        <span style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>
          {label}
        </span>
      </div>
    ))}
  </Layout.Box>
);

// ── Row ───────────────────────────────────────────────────────────────────────

interface RowProps {
  medal: string | null;
  position: number;
  members: { displayName: string; profile: string }[];
  scores: ScoreCell[];
  scoreColumnCount: number;
}

const Row = ({ medal, position, members, scores, scoreColumnCount }: RowProps) => {
  return (
    <Layout.Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: "6px 14px",
        width: "100%",
      }}
    >
      {/* Medal */}
      <div
        style={{
          display: "flex",
          width: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {medal ? (
          <img src={loadImage(medal)} width={36} height={36} />
        ) : (
          <div style={{ display: "flex", width: 36, height: 36 }} />
        )}
      </div>

      {/* Placement */}
      <div style={{ display: "flex", width: 68, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 24, color: "white", fontWeight: "bold" }}>
          #{position}
        </span>
      </div>

      {/* Player name(s) — horizontal */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "nowrap",
          overflow: "hidden",
          gap: 6,
        }}
      >
        {members.map((m, i) => (
          <div
            key={`${m.displayName}-${i}`}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.displayName}
            </span>
            {i < members.length - 1 && (
              <span style={{ fontSize: 20, color: "#9aa4b2" }}>·</span>
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
            gap: 6,
            width: scoreColumnWidth(scoreColumnCount),
            justifyContent: "flex-start",
          }}
        >
          {cell.icon && (
            <img src={loadImage(cell.icon)} width={26} height={26} />
          )}
          <span
            style={{
              fontSize: 22,
              color: "white",
              fontWeight: i === 0 ? "bold" : "normal",
            }}
          >
            {cell.value}
          </span>
        </div>
      ))}
    </Layout.Box>
  );
};

// ── Main profile ──────────────────────────────────────────────────────────────

export function LeaderboardProfile({
  data,
  type,
  subtitle,
  medalsMode,
  page,
  pageSize,
}: LeaderboardProfileProps): JSX.Element {

  const totalTeams = data.teams.length;
  const start      = page * pageSize;
  const end        = Math.min(start + pageSize, totalTeams);
  const visible    = data.teams.slice(start, end);

  const headers          = scoreHeaders(type, data.scoringType);
  const scoreColumnCount = headers.length;

  return (
    <Layout.Container>
      <Event.Header
        eventType={type}
        eventName={data.name}
        difficulty={subtitle}
      />

      <HeaderRow headers={headers} scoreColumnCount={scoreColumnCount} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 3,
        }}
      >
        {visible.map((team) => {
          const medal  = BaseLeaderboard.getMedal(medalsMode, team.position, totalTeams);
          const scores = formatScoreParts(type, data.scoringType, team.scoreParts);

          return (
            <Row
              key={team.position}
              medal={medal}
              position={team.position}
              members={team.members}
              scores={scores}
              scoreColumnCount={scoreColumnCount}
            />
          );
        })}
      </div>
    </Layout.Container>
  );
}
