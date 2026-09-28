import { BaseLeaderboard, type LeaderboardJob } from "./leaderboard.cache.base";
import { API_URLS } from "@btd6/constants";
import { getData, sleep } from "@lib";
import { logError } from "@discord/error/error.log";
import {
  EventType,
  ScoringType,
  type CTBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team,
} from "@btd6/types";

const modes = ["player", "team"] as const;

export class CTLeaderboard extends BaseLeaderboard<CTBody> {
  public readonly eventType = EventType.CT;

  protected async *formatLeaderboard(event: CTBody): AsyncGenerator<LeaderboardJob> {
    for (const mode of modes) {
      const url = `${API_URLS.CT}/${event.id}/leaderboard/${mode}`;

      try {
        const teams = await this.getTeams(url);

        if (teams.length > 0) {
          yield {
            path: `Leaderboard/CT/${event.id}/${mode}/leaderboard.json`,
            data: {
              id: event.id,
              start: event.start,
              end: event.end,
              eventType: EventType.CT,
              name: event.name,
              totalScores: teams.length,
              scoringType: ScoringType.CTPoints,
              teams,
            },
          };
        }
      } catch (error) {
        await logError(`CT ${event.id}: ${mode}`, error);
      }

      await sleep(5_000);
    }
  }

  private async getTeams(url: string): Promise<Team[]> {

    let page = 1;
    let position = 1;
    const teams: Team[] = [];

    while (true) {
      const data = await getData<Leaderboard & { error?: string | null }>(`${url}?page=${page}`,);

      if (!data.success) {
        if (page === 1 && data.error === "No Scores Available") break;
        throw new Error(`CT API error at ${url}?page=${page}: ${data.error ?? "success=false"}`,);
      }

      if (data.body.length === 0) {
        if (page === 1) break;
        throw new Error(`Unexpected empty CT page: ${url}?page=${page}`);
      }

      for (const entry of data.body) {
        teams.push(this.mapPlayer(entry, position));
        position++;
      }

      if (!data.next) break;
      page++;
    }

    return teams;
  }

  private mapPlayer(entry: LeaderboardBody, position: number): Team {
    
    return {
      position,
      members: [{
        displayName: entry.displayName,
        profile: entry.profile,
      }],
      scoreParts: {
        score: entry.score,
      },
    };
  }
}
