export type Difficulty = string | undefined;

export type EventExtension = Record<string, string> | string | undefined;

export interface EventURLs {
  base: string;
  extension?: EventExtension;
  totalScores?: string;
}

export function getExtension(event: EventURLs, eventId: string, difficulty?: string): string {

  let attribute = "";

  if (typeof event.extension === "object" && event.extension !== null) {
    const key = difficulty?.toLowerCase() ?? "";
    attribute = `/${eventId}/${event.extension[key] ?? ""}`;
  } else if (typeof event.extension === "string") {
    attribute = `/${eventId}/${event.extension}`;
  }

  return `${event.base}${attribute}`;
}

export const URLS: Record<string, EventURLs> = {
  Boss: {
    base: "https://data.ninjakiwi.com/btd6/bosses",
    extension: {
      standard: "metadata/standard",
      elite: "metadata/elite"
    },
    totalScores: "totalScores_{}"
  },

  Race: {
    base: "https://data.ninjakiwi.com/btd6/races",
    extension: "metadata",
    totalScores: "totalScores"
  },

  Odyssey: {
    base: "https://data.ninjakiwi.com/btd6/odyssey",
    extension: {
      easy: "easy",
      medium: "medium",
      hard: "hard"
    }
  },

  CT: {
    base: "https://data.ninjakiwi.com/btd6/ct",
    totalScores: "totalScores_{}"
  },

  Tile: {
    base: "https://storage.googleapis.com/btd6-ct-map/events/{}/tiles.json",
  },

  BossLB: {
    base: "https://storage.googleapis.com/btd6_boss_leaderboard/{}/{}/{}/leaderboard.json"
  },

  Challenge: {
    base: "https://data.ninjakiwi.com/btd6/challenges/challenge/{}"
  },

  ChallengeDaily: {
    base: "https://data.ninjakiwi.com/btd6/challenges/filter/daily",
    extension: "metadata"
  },

  Emojis: {
    base: "https://discord.com/api/v10/applications/{}/emojis"
  },

  Events: {
    base: "https://data.ninjakiwi.com/btd6/events"
  }
};