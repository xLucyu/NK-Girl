import { gsc } from "@btd6/storage";
import type {
  BaseBody,
  EventType,
  LeaderboardPayload
} from "@btd6/types";

export interface LeaderboardJob {
  path: string;
  data: LeaderboardPayload;
}

export abstract class BaseLeaderboard<T extends BaseBody> {

  public abstract readonly eventType: EventType;

  public async refresh(event: T): Promise<void> {

    const payloads = await this.formatLeaderboard(event);
    await Promise.all(payloads.map(payload => gsc.write(payload.path, payload.data)));

  }

  protected abstract formatLeaderboard(event: T): Promise<LeaderboardJob[]>;
}