import {
  API_URLS,
  LeaderboardPayload,
  EventType,
  type RaceBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team,
} from "@utils";
import { BaseLeaderboardService, Payload } from "./base";
import { getData } from "@api";

export class RaceLeaderboardService extends BaseLeaderboardService<RaceBody,LeaderboardPayload> {

  public readonly eventType = EventType.Race;
  private baseUrl = API_URLS.Race;

  protected async formatLeaderboard(event: RaceBody): Promise<Payload<LeaderboardPayload>[]> {
    
    const url = `${this.baseUrl}/${event.id}/leaderboard`;
    const teams = await this.handleFormatting(url);

    return [
      {
        path: `Leaderboard/Race/${event.name}/leaderboard.json`,
        data: {
          id: event.id,
          eventType: EventType.Race,
          name: event.name,
          totalScores: teams.length,
          scoringType: "Game Time",
          teams,
        },
      },
    ];
  }


  private async handleFormatting(url: string): Promise<Team[]> {

    let initialPage = 1;
    let position = 1;
    const teams: Team[] = [];

    while (true) {
      const currentLeaderboardInfo = await getData<Leaderboard>(`${url}?page=${initialPage}`);

      if (!currentLeaderboardInfo?.success || !currentLeaderboardInfo.body?.length) break;
    
      for (const player of currentLeaderboardInfo.body) {
        teams.push(this.mapPlayerToTeam(player, position));
        position++;
      }
      initialPage++;
    }
    return teams;
  }

  private mapPlayerToTeam(player: LeaderboardBody, position: number): Team {
    return {
      position,
      members: [
        {
          displayName: player.displayName,
          profile: player.profile,
        },
      ],
      scoreParts: {
        score: player.scoreParts[0]?.score,
        secondScore: player.scoreParts[1]?.score,
      },
    };
  }
}
