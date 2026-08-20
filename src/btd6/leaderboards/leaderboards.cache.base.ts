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

  public async refresh(event: T): Promise<LeaderboardJob[]> {
    return this.formatLeaderboard(event);
  }

  protected abstract formatLeaderboard(event: T): Promise<LeaderboardJob[]>;
}
