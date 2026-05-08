import { GoogleStorageService } from "../services/googleStorage";
import { getData } from "../../api/wrapper";
import type { Leaderboard } from "../../utils/types";

export class CTLeaderboardUploader {
  constructor(
    private readonly storage: GoogleStorageService,
    private readonly baseURL: string,
  ) {}

  public async uploadCurrentCTLeaderboard(currentCTId: string): Promise<void> {
    const leaderboard = await getData<Leaderboard>(
      `${this.baseURL}/${currentCTId}/leaderboard`,
    );

    await Promise.all([
      this.storage.uploadJson(
        `leaderboards/ct/current.json`,
        leaderboard,
      ),
      this.storage.uploadJson(
        `leaderboards/ct/events/${currentCTId}.json`,
        leaderboard,
      ),
    ]);
  }
}
