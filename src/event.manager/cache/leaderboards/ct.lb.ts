import { 
    CTBody, 
    Leaderboard, 
    LeaderboardBody, 
    LeaderboardPayload, 
    Team 
} from "@utils/types";
import { BaseLeaderboardService, Payload } from "./base";
import { EventType } from "..";
import { API_URLS } from "@utils/assets";
import { getData } from "@wrapper";

const modes = ["player", "team"] as const;

export class CTLeaderboardService extends BaseLeaderboardService<CTBody, LeaderboardPayload> {
    
    public readonly eventType = EventType.CT;
    private baseUrl = API_URLS.CT;

    protected formatLeaderboard(event: CTBody): Promise<Payload<LeaderboardPayload>[]> {
        
        return Promise.all(
            modes.map(async (mode) => {
                const url = `${this.baseUrl}/${event.id}/leaderboard/${mode}`;
                const teams = await this.handleFormatting(url);
                return {
                    path: `Leaderboard/CT/${event.id}/${mode}`,
                    data: {
                        id: event.id,
                        eventType: EventType.CT,
                        name: event.name,
                        totalScores: teams.length,
                        scoringType: "CTPoints",
                        teams: teams
                    }
                }
            })
        )
    }

    private async handleFormatting(url: string): Promise<Team[]> {

        let initialPage = 1;
        let position = 1;
        const teams: Team[] = [];

        while (true) {

            const currentLeaderboardInfo = await getData<Leaderboard>(`${url}?page=${initialPage}`);
            if (!currentLeaderboardInfo?.success || !currentLeaderboardInfo.body?.length) break;

            for (const player of currentLeaderboardInfo.body) {
                teams.push(this.mapEntryToTeam(player, position));
                position++;
            }
            initialPage++;
        }
        return teams;
  }


  private mapEntryToTeam(entry: LeaderboardBody, position: number): Team {

    return {
      position,
      members: [
        {
          displayName: entry.displayName,
          profile: entry.profile,
        },
      ],
      scoreParts: {
        score: entry.score,
      },
    };
  }
}