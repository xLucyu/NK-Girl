import { BaseLeaderboard, type LeaderboardJob } from "./leaderboard.cache.base";

import { API_URLS } from "@btd6/constants";
import { getData, sleep } from "@lib";

import {
  BossDifficulties,
  EventType,
  ScoringType,
  type BossBody,
  type Leaderboard,
  type LeaderboardBody,
  type Team
} from "@btd6/types";

const players = [1, 2, 3, 4];

export class BossLeaderboard extends BaseLeaderboard<BossBody> {

  public readonly eventType = EventType.Boss;

  protected async formatLeaderboard(event: BossBody): Promise<LeaderboardJob[]> {

    const jobs: LeaderboardJob[] = [];

    for (const difficulty of BossDifficulties) {
      for (const playerCount of players) {

        const url = `${API_URLS.Boss}/${event.id}/leaderboard/${difficulty.toLowerCase()}/${playerCount}`;
        const scoringType = difficulty === "Elite" ? event.eliteScoringType : event.normalScoringType;
        const teams = Array.from((await this.getTeams(url, scoringType)).values());

        jobs.push({
          path: `Leaderboard/Boss/${event.name}/${difficulty}/${playerCount}/leaderboard.json`,
          data: {
            id: event.id,
            start: event.start,
            end: event.end,
            eventType: EventType.Boss,
            name: event.name,
            totalScores: teams.length,
            scoringType,
            teams
          }
        });

        await sleep(10_000);
      }
    }
    return jobs;
  }


  private async getTeams(url: string, scoringType: ScoringType): Promise<Map<string, Team>> {

    let page = 1;
    let position = 1;

    const teams = new Map<string, Team>();

    while (true) {

      const data = await getData<Leaderboard>(`${url}?page=${page}`);

      if (!data.success || !data.body.length) break;

      for (const player of data.body) {

        const { actualScore, bucketedScore } = this.getScoreKey(player, scoringType);

        const key = bucketedScore.join("-");
        const existing = teams.get(key);

        if (existing) {

          existing.members.push({
            displayName: player.displayName,
            profile: player.profile
          });
          continue;
        }

        teams.set(key, {
          position,
          members: [{
            displayName: player.displayName,
            profile: player.profile
          }],
          scoreParts: {
            score: actualScore[0],
            secondScore: actualScore[1],
            thirdScore: actualScore[2]
          }
        });
        position++;
      }
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