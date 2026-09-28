import { gsc } from "@btd6/storage";
import type {
  BaseBody,
  EventType,
  LeaderboardPayload
} from "@btd6/types";
import { logError } from "@discord";

export interface LeaderboardJob {
  path: string;
  data: LeaderboardPayload;
}

export abstract class BaseLeaderboard<T extends BaseBody> {

  public abstract readonly eventType: EventType;

  public async refresh(event: T): Promise<void> {

    const payloads = await this.formatLeaderboard(event);

    for await (const payload of payloads) {

      try {
        await gsc.write(payload.path, payload.data);
        gsc.invalidate(this.eventType, "Leaderboard");
      } catch (error) {
        await logError(`Leaderboard upload: ${payload.path}`, error);
      }
    }
  }

  protected abstract formatLeaderboard(event: T): Promise<LeaderboardJob[]> | AsyncIterable<LeaderboardJob>;
}
