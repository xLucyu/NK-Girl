import { BaseLeaderboard, type LeaderboardJob } from "./leaderboard.cache.base";
import { addUnderscore, getData } from "@lib";
import { API_URLS } from "@btd6/constants";
import { logError } from "@discord/error/error.log";
import {
  EventType,
  ScoringType,
  type RaceBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team,
} from "@btd6/types";

export class RaceLeaderboard extends BaseLeaderboard<RaceBody> {
  
  public readonly eventType = EventType.Race;

  protected async *formatLeaderboard(event: RaceBody): AsyncGenerator<LeaderboardJob> {

    const url = `${API_URLS.Race}/${event.id}/leaderboard`;

    try {
      const teams = await this.getTeams(url);
      if (teams.length === 0) return;

   
      yield {
        path: `Leaderboard/Race/${addUnderscore(event.name)}/leaderboard.json`,
        data: {
          id: event.id,
          start: event.start,
          end: event.end,
          eventType: EventType.Race,
          name: event.name,
          totalScores: teams.length,
          scoringType: ScoringType.GameTime,
          teams,
        },
      };
    } catch (error) {
      await logError(`Race ${event.name} (${event.id})`, error);
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
        throw new Error(
          `Race API error at ${url}?page=${page}: ${data.error ?? "success=false"}`,
        );
      }

      if (data.body.length === 0) {
        if (page === 1) break;
        throw new Error(`Unexpected empty Race page: ${url}?page=${page}`);
      }

      for (const player of data.body) {
        teams.push(this.mapPlayer(player, position));
        position++;
      }

      if (!data.next) break;
      page++;
    }

    return teams;
  }

  private mapPlayer(player: LeaderboardBody, position: number): Team {

    return {
      position,
      members: [{
        displayName: player.displayName,
        profile: player.profile,
      }],
      scoreParts: {
        score: player.scoreParts[0]?.score,
        secondScore: player.scoreParts[1]?.score,
      },
    };
  }
}
