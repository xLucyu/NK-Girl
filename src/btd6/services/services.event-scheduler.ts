import cron, { ScheduledTask } from "node-cron";
import { EventType } from "@btd6/types";
import {
  BossCache,
  BossRushCache,
  RaceCache,
  OdysseyCache,
  CollectionCache,
  CTCache,
  EventCacheEntry,
  DailyChallengeCache
} from "@btd6/cache/events";
import {
  BossLeaderboard,
  RaceLeaderboard,
  CTLeaderboard
} from "@btd6/cache/leaderboards";
import { eventAnnouncer } from "./services.event-announcer";
import { logError } from "@discord";

interface CacheMap {
  [EventType.Boss]: BossCache;
  [EventType.BossRush]: BossRushCache;
  [EventType.Race]: RaceCache;
  [EventType.Odyssey]: OdysseyCache;
  [EventType.Collection]: CollectionCache;
  [EventType.CT]: CTCache;
  [EventType.DailyChallenge]: DailyChallengeCache;
}

export class EventScheduler {

  private job: ScheduledTask | null = null;
  private readonly initialized = new Set<EventType>();

  private readonly caches: CacheMap = {
    [EventType.Boss]: new BossCache(),
    [EventType.BossRush]: new BossRushCache(),
    [EventType.Race]: new RaceCache(),
    [EventType.Odyssey]: new OdysseyCache(),
    [EventType.Collection]: new CollectionCache(),
    [EventType.CT]: new CTCache(),
    [EventType.DailyChallenge]: new DailyChallengeCache()
  };

  private readonly leaderboards = {
    [EventType.Boss]: new BossLeaderboard(),
    [EventType.Race]: new RaceLeaderboard(),
    [EventType.CT]: new CTLeaderboard()
  };

  public async start(): Promise<void> {

    await this.runEventChecks();

    this.job = cron.schedule("0 * * * *", async () => {
      await this.runCycle();
    });
  }

  public stop(): void {

    this.job?.stop();
    this.job = null;
  }

  public getEventCache<T extends EventType>(eventType: T): CacheMap[T] {
    return this.caches[eventType];
  }

  private async runCycle(): Promise<void> {

    await this.runEventChecks();
    await this.runLeaderboardChecks();
  }

  private async runEventChecks(): Promise<void> {

    const results = await Promise.allSettled(
      Object.values(this.caches).map(cache => cache.refresh())
    );

    for (const result of results) {

      if (result.status === "rejected") {
        await this.logErrors(results);
        continue;
      }

      const event = result.value;

      if (!event) continue;

      if (!this.initialized.has(event.eventType)) {
        this.initialized.add(event.eventType);
        continue;
      }

      await this.handleAnnouncement(event);
    }
  }

  private async runLeaderboardChecks(): Promise<void> {

    const results = await Promise.allSettled(
      Object.values(this.leaderboards).map(async leaderboard => {

        const cache = this.caches[leaderboard.eventType];
        const event = cache.getCache()?.currentEvent.data;

        if (!event) return;

        await leaderboard.refresh(event as never);
      })
    );

    await this.logErrors(results);
  }

  private async handleAnnouncement(event: EventCacheEntry<any, any>): Promise<void> {
    await eventAnnouncer.sendAll(event);
  }

  private async logErrors(results: PromiseSettledResult<unknown>[]): Promise<void> {

    for (const result of results) {
      if (result.status === "rejected") await logError("Announcer", result.reason);
    }
  }
}

export const eventScheduler = new EventScheduler();