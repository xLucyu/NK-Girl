import { GoogleStorageService } from "../services/googleStorage";
import { getData } from "../../api/wrapper";
import type { Leaderboard } from "../../utils/types";

// clean up ai to your own version

export class CTLeaderboardUploader {
  constructor(
    private readonly storage: GoogleStorageService,
    private readonly baseURL: string,
  ) {}

  public async uploadCurrentCTLeaderboards(currentCT: { id: string; name: string }): Promise<void> {
    const [playersPayload, teamsPayload] = await Promise.all([
      this.buildCTLeaderboard(currentCT, "players"),
      this.buildCTLeaderboard(currentCT, "teams"),
    ]);

    await Promise.all([
      this.storage.uploadJson("leaderboards/ct/current/players.json", playersPayload),
      this.storage.uploadJson("leaderboards/ct/current/teams.json", teamsPayload),

      this.storage.uploadJson(`leaderboards/ct/events/${currentCT.id}/players.json`, playersPayload),
      this.storage.uploadJson(`leaderboards/ct/events/${currentCT.id}/teams.json`, teamsPayload),
    ]);
  }

  private async buildCTLeaderboard(
    currentCT: { id: string; name: string },
    mode: "players" | "teams",
  ): Promise<LeaderboardPayload> {
    const entries = await getAllLeaderboardPages(
      `${this.baseURL}/${currentCT.id}/leaderboard/${mode}`
    );

    return {
      id: currentCT.id,
      eventType: "CT",
      mode,
      name: currentCT.name,
      totalScores: entries.length,
      scoringType: "CTPoints", // replace with your real value if needed
      teams: entries.map((entry, index) => ({
        position: index + 1,
        members: this.mapMembers(entry, mode),
        scoreParts: {
          primary: entry.scoreParts[0]?.score ?? 0,
          secondary: entry.scoreParts[1]?.score ?? null,
          tertiary: entry.scoreParts[2]?.score ?? null,
        },
      })),
    };
  }

  private mapMembers(entry: any, mode: "players" | "teams"): Member[] {
    if (mode === "players") {
      return [
        {
          displayName: entry.displayName,
          profile: entry.profile,
        },
      ];
    }

    return entry.members.map((member: any) => ({
      displayName: member.displayName,
      profile: member.profile,
    }));
  }
}
