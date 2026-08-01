import cron, { ScheduledTask } from "node-cron";
import { 
  BossCache,
  RaceCache,
  OdysseyCache,
  CollectionCache,
  CTCache,
  BossLeaderboardSerivce,
  RaceLeaderboardService,
  CTLeaderboardService
} from "@manager";
import { EventType } from "@utils";
import { BossRushCache } from "./cache/events/boss-rush";

interface CacheMap {
  [EventType.Boss]: BossCache;
  [EventType.BossRush]: BossRushCache;
  [EventType.Race]: RaceCache;
  [EventType.Odyssey]: OdysseyCache;
  [EventType.Collection]: CollectionCache;
  [EventType.CT]: CTCache;
}


export class EventManager {

  private job: ScheduledTask | null = null;

  private caches = {
    [EventType.Boss]: new BossCache(),
    [EventType.Race]: new RaceCache(),
    [EventType.CT]: new CTCache(),
    [EventType.Collection]: new CollectionCache(),
    [EventType.Odyssey]: new OdysseyCache(),
    [EventType.BossRush]: new BossRushCache()
  };
  private leaderboards = {
    [EventType.Boss]: new BossLeaderboardSerivce(),
    [EventType.Race]: new RaceLeaderboardService(),
    [EventType.CT]: new CTLeaderboardService()
  }

  public async start(): Promise<void> {

    this.job = cron.schedule("0 * * * *", async () => {
      await this.runCycle();
    });

    await this.runCycle(true);
  }

  public getEventCache<T extends EventType>(mode: T): CacheMap[T] {
    return this.caches[mode];
  }

  private async runCycle(firstUse: boolean = false): Promise<void> {

    try {
      await this.runEventChecks(firstUse);
      if (!firstUse) await this.runLeaderboardChecks();
    } catch (error) {
      console.error("Event Cycle failed", error);
      return;
    }
  }


  private async runEventChecks(firstUse: boolean = false): Promise<void> {

    const results = await Promise.allSettled(
      Object.values(this.caches).map((cache) => cache.check(firstUse))
    );

    this.logError(results);
  }

  private async runLeaderboardChecks(): Promise<void> {

    const results = await Promise.allSettled(
      Object.values(this.leaderboards).map((service) => {
        const currentEvent = this.caches[service.eventType as keyof typeof this.caches]
          .getCache()?.currentEvent.data;
        if (!currentEvent) return;
        service.check(currentEvent as never);
      })
    );
    this.logError(results);
  }

  private logError(results: PromiseSettledResult<void>[]): void {

    for (const result of results) {
      if (result.status === "rejected") console.error(result.reason);
    }
  }
}

export const eventManager = new EventManager();
