import { BaseLeaderboard, type LeaderboardJob } from "./leaderboard.cache.base";
import { API_URLS } from "@btd6/constants";
import { getData, sleep } from "@lib";
import { logError } from "@discord/error/error.log";
import {
  BossDifficulties,
  EventType,
  ScoringType,
  type BossBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team,
} from "@btd6/types";

const players = [1, 2, 3, 4];

export class BossLeaderboard extends BaseLeaderboard<BossBody> {

  public readonly eventType = EventType.Boss;

  protected async *formatLeaderboard(event: BossBody): AsyncGenerator<LeaderboardJob> {

    for (const difficulty of BossDifficulties) {
      for (const playerCount of players) {
        const url = `${API_URLS.Boss}/${event.id}/leaderboard/${difficulty.toLowerCase()}/${playerCount}`;
        const scoringType = difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;
        try {
          const teams = Array.from((await this.getTeams(url, scoringType, playerCount)).values(),);

          if (teams.length > 0) {
            // The base class saves this job before requesting the next one.
            yield {
              path: `Leaderboard/Boss/${event.name}/${difficulty}/${playerCount}/leaderboard.json`,
              data: {
                id: event.id,
                start: event.start,
                end: event.end,
                eventType: EventType.Boss,
                name: event.name,
                totalScores: teams.length,
                scoringType,
                teams,
              },
            };
          }
        } catch (error) {
          await logError(
            `Boss ${event.name}: ${difficulty}, ${playerCount} player(s)`,
            error,
          );
        }

        await sleep(10_000);
      }
    }
  }

  private async getTeams(
    url: string,
    scoringType: ScoringType,
    playerCount: number,
  ): Promise<Map<string, Team>> {

    let page = 1;
    let position = 1;
    const teams = new Map<string, Team>();

    while (true) {
      const data = await getData<Leaderboard & { error?: string | null }>(`${url}?page=${page}`,);

      if (!data.success) {

        if (page === 1 && data.error === "No Scores Available") break;
        throw new Error(`Boss API error at ${url}?page=${page}: ${data.error ?? "success=false"}`,);
      }

      if (data.body.length === 0) {
        if (page === 1) break;
        throw new Error(`Unexpected empty Boss page: ${url}?page=${page}`);
      }

      for (const player of data.body) {
        const { actualScore, bucketedScore } = this.getScoreKey(player, scoringType);
        const key = playerCount === 1 ? String(position) : bucketedScore.join("-");
        const existing = teams.get(key);

        if (existing) {
          existing.members.push({
            displayName: player.displayName,
            profile: player.profile,
          });
          continue;
        }

        teams.set(key, {
          position,
          members: [{
            displayName: player.displayName,
            profile: player.profile,
          }],
          scoreParts: {
            score: actualScore[0],
            secondScore: actualScore[1],
            thirdScore: actualScore[2],
          },
        });
        position++;
      }

      if (!data.next) break;
      page++;
    }

    return teams;
  }

  private getScoreKey(player: LeaderboardBody, scoringType: ScoringType): {
    actualScore: number[];
    bucketedScore: number[];
  } {

    const actualScore = [
      player.scoreParts[0].score,
      player.scoreParts[1].score
    ];

    const bucketedScore = [...actualScore];

    if (scoringType !== ScoringType.GameTime) {

      const score = player.scoreParts[2].score;

      actualScore.push(score);

      bucketedScore.push(
        Math.floor(score * 2) / 2
      );
    }

    return {
      actualScore,
      bucketedScore
    };
  }
}
