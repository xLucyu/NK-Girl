import { GoogleStorageService } from "../services/googleStorage";
import { getData } from "../../api/wrapper";
import type { Leaderboard } from "../../utils/types";

// clean up ai to your own version

import { getData } from "../../api/wrapper";
import type { BaseBody } from "../../utils/types";
import { GoogleStorageService } from "../services/googleStorage";


type CTMode = "players" | "teams";

export class CTLeaderboardUploader {
  constructor(
    private readonly storage: GoogleStorageService,
    private readonly baseURL: string,
  ) {}

  public async uploadCurrentCTLeaderboards(currentCT: CTBody): Promise<void> {
    const [playersPayload, teamsPayload] = await Promise.all([
      this.buildPlayersLeaderboard(currentCT),
      this.buildTeamsLeaderboard(currentCT),
    ]);

    await Promise.all([
      this.storage.uploadJson(
        `leaderboards/ct/${currentCT.id}/players.json`,
        playersPayload,
      ),
      this.storage.uploadJson(
        `leaderboards/ct/${currentCT.id}/teams.json`,
        teamsPayload,
      ),
    ]);
  }

  private async buildPlayersLeaderboard(currentCT: CTBody): Promise<BossLB> {
    const entries = await this.getAllPages<PlayerLeaderboardEntry>(
      this.getLeaderboardUrl(currentCT.id, "players"),
    );

    return {
      id: currentCT.id,
      boss: currentCT.name,
      totalScores: entries.length,
      scoringType: "CTPlayers",
      teams: entries.map((entry, index) => ({
        position: index + 1,
        members: [
          {
            displayName: entry.displayName,
            profile: entry.profile,
          },
        ],
        scoreParts: this.mapScoreParts(entry.scoreParts),
      })),
    };
  }

  private async buildTeamsLeaderboard(currentCT: CTBody): Promise<BossLB> {
    const entries = await this.getAllPages<TeamLeaderboardEntry>(
      this.getLeaderboardUrl(currentCT.id, "teams"),
    );

    return {
      id: currentCT.id,
      boss: currentCT.name,
      totalScores: entries.length,
      scoringType: "CTTeams",
      teams: entries.map((entry, index) => ({
        position: index + 1,
        members: entry.members.map((member) => ({
          displayName: member.displayName,
          profile: member.profile,
        })),
        scoreParts: this.mapScoreParts(entry.scoreParts),
      })),
    };
  }

  private getLeaderboardUrl(eventId: string, mode: CTMode): string {
    /*
      Adjust these path segments to match the real NK endpoint.
      Examples depending on API:
      - /leaderboard/player
      - /leaderboard/players
      - /leaderboard/team
      - /leaderboard/teams
    */
    const segment = mode === "players" ? "player" : "team";
    return `${this.baseURL}/${eventId}/leaderboard/${segment}`;
  }

  private mapScoreParts(scoreParts: ScorePart[]): BossScoreParts {
    return {
      bossTier: scoreParts[0]?.score ?? 0,
      score: scoreParts[1]?.score ?? 0,
      secondScore: scoreParts[2]?.score ?? null,
    };
  }

  private async getAllPages<T>(baseUrl: string): Promise<T[]> {
    let page = 1;
    const allEntries: T[] = [];

    while (true) {
      try {
        const data = await getData<NkData<T>>(`${baseUrl}?page=${page}`);

        if (!data?.body || data.body.length === 0) {
          break;
        }

        allEntries.push(...data.body);
        page++;
      } catch {
        break;
      }
    }
    return allEntries;
  }
}
