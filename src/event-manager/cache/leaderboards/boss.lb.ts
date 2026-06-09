import { 
    BossBody,
    Leaderboard,
    BossDifficulties,
    LeaderboardBody, 
    LeaderboardPayload, 
    Team,
    EventType,
    API_URLS,
    sleep,
} from "@utils";
import { BaseLeaderboardService, Payload } from "./base";
import { getData } from "@wrapper";


export enum ScoringType {
  GameTime = "GameTime",
  LeastCash = "LeastCash",
  LeastTiers = "LeastTiers"
}

const players = [1, 2, 3, 4];

export class BossLeaderboardSerivce extends BaseLeaderboardService<BossBody, LeaderboardPayload> {

  public readonly eventType = EventType.Boss;
  private baseUrl = API_URLS.Boss;

  protected async formatLeaderboard(event: BossBody): Promise<Payload<LeaderboardPayload>[]> {
    
    const payloads: Payload<LeaderboardPayload>[] = [];

    for (const difficulty of BossDifficulties) {
        for (const playerCount of players) {
            const url = `${this.baseUrl}/${event.id}/leaderboard/${difficulty.toLocaleLowerCase()}/${playerCount}`;
            const currentScoringType = difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;

            const teamsMap = await this.handleFormatting(url, currentScoringType);
            const teams = Array.from(teamsMap.values());

            payloads.push({
                path: `Leaderboard/Boss/${event.id}/${difficulty}/${playerCount}/leaderboard.json`,
                data: {
                    id: event.id,
                    eventType: EventType.Boss,
                    name: event.name,
                    totalScores: teams.length,
                    scoringType: currentScoringType,
                    teams
                }
            });
            await sleep(10_000);
        }
    }

    return payloads;
}


  private async handleFormatting(url: string, currentScoringType: string): Promise<Map<string, Team>> {
    
    let initialPage = 1;
    let position = 1;
    const scoreboard = new Map<string, Team>();

    while (true) {

      const currentLeaderboardInfo = await getData<Leaderboard>(`${url}?page=${initialPage}`);

      if (!currentLeaderboardInfo?.success || !currentLeaderboardInfo.body?.length) break;

      for (const player of currentLeaderboardInfo.body) {
        const { actualScore, bucketedScore } = this.getScoreKey(player, currentScoringType);
        const scoreKey = bucketedScore.join("-");
        if (scoreboard.has(scoreKey)) {
          scoreboard.get(scoreKey)!.members.push({
            displayName: player.displayName,
            profile: player.profile,
          });
        } else {
          scoreboard.set(scoreKey, {
            position,
            members: [
              {
                displayName: player.displayName,
                profile: player.profile,
              },
            ],
            scoreParts: {
              score: actualScore[0],
              secondScore: actualScore[1],
              thirdScore: actualScore[2],
            },
          });
          position++;
        }
      }
      initialPage++;
    }
    return scoreboard;
  }

  
  private getScoreKey(player: LeaderboardBody, currentScoringType: string): { bucketedScore: number[]; actualScore: number[] } {

    const actualScore = [
      player.scoreParts[0].score,
      player.scoreParts[1].score,
    ];

    const bucketedScore = [...actualScore];

    if (currentScoringType !== ScoringType.GameTime) {

      const rawSecondScore = player.scoreParts[2].score;
      const bucketedSecondScore = Math.floor(rawSecondScore * 2) / 2;
      actualScore.push(rawSecondScore);
      bucketedScore.push(bucketedSecondScore);
    }

    return { actualScore, bucketedScore };
  }
}
