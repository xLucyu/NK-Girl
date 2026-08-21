import { BaseLeaderboard, LeaderboardJob } from "./leaderboard.cache.base";
import { addUnderscore, getData } from "@lib";
import { API_URLS } from "@btd6/constants";
import {
  EventType,
  ScoringType,
  RaceBody,
  Leaderboard,
  LeaderboardBody,
  Team
} from "@btd6/types";


export class RaceLeaderboard extends BaseLeaderboard<RaceBody> {

  public readonly eventType = EventType.Race;

  protected async formatLeaderboard(event: RaceBody): Promise<LeaderboardJob[]> {

    const url = `${API_URLS.Race}/${event.id}/leaderboard`;
    const teams = await this.getTeams(url);

    return [{
      path:`Leaderboard/Race/${addUnderscore(event.name)}/leaderboard.json`,
      data: {
        id: event.id,
        start: event.start,
        end: event.end,
        eventType: EventType.Race,
        name: event.name,
        totalScores: teams.length,
        scoringType: ScoringType.GameTime,
        teams
      }
    }];
  }

  private async getTeams(url: string): Promise<Team[]> {

    let page = 1;
    let position = 1;

    const teams: Team[] = [];

    while (true) {

      const data = await getData<Leaderboard>(`${url}?page=${page}`);

      if (!data.success || !data.body.length) break;

      for (const player of data.body) {
        teams.push(this.mapPlayer(player, position));
        position++;
      }
      page++;
    }
    return teams;
  }


  private mapPlayer(player: LeaderboardBody, position: number): Team {

    return {
      position,
      members: [{
        displayName: player.displayName,
        profile: player.profile
      }],
      scoreParts: {
        score: player.scoreParts[0]?.score,
        secondScore: player.scoreParts[1]?.score
      }
    };
  }
}