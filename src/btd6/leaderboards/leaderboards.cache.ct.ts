import { BaseLeaderboard, type LeaderboardJob } from "./leaderboard.cache.base";
import { API_URLS } from "@btd6/constants";
import { getData, sleep } from "@lib";
import {
  EventType,
  ScoringType,
  type CTBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team
} from "@btd6/types";

const modes = ["player", "team"] as const;

export class CTLeaderboard extends BaseLeaderboard<CTBody> {

  public readonly eventType = EventType.CT;


  protected async formatLeaderboard(event: CTBody): Promise<LeaderboardJob[]> {

    const jobs: LeaderboardJob[] = [];

    for (const mode of modes) {

      const url = `${API_URLS.CT}/${event.id}/leaderboard/${mode}`;

      const teams = await this.getTeams(url);

      jobs.push({
        path:
          `Leaderboard/CT/${event.id}/${mode}/leaderboard.json`,
        data: {
          id: event.id,
          start: event.start,
          end: event.end,
          eventType: EventType.CT,
          name: event.name,
          totalScores: teams.length,
          scoringType: ScoringType.CTPoints,
          teams
        }
      });
      await sleep(5_000);
    }
    return jobs;
  }


  private async getTeams(url: string): Promise<Team[]> {

    let page = 1;
    let position = 1;

    const teams: Team[] = [];

    while (true) {

      const data = await getData<Leaderboard>(`${url}?page=${page}`);

      if (!data.success || !data.body.length) break;

      for (const entry of data.body) {
        teams.push(this.mapEntry(entry, position));
        position++;
      }
      page++;
    }
    return teams;
  }


  private mapEntry(entry: LeaderboardBody, position: number): Team {
    return {
      position,
      members: [{
        displayName: entry.displayName,
        profile: entry.profile
      }],
      scoreParts: {
        score: entry.score
      }
    };
  }
}