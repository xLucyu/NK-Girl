import cron, { ScheduledTask } from "node-cron";
import { 
    BossCache,
    RaceCache,
    OdysseyCache,
    CollectionCache,
    CTCache
} from "./cache/events";
import { EventType } from "./cache/events/base";

interface CacheMap {
  [EventType.Boss]: BossCache;
  [EventType.Race]: RaceCache;
  [EventType.Odyssey]: OdysseyCache;
  [EventType.Collection]: CollectionCache;
  [EventType.CT]: CTCache;
}

export class EventManager {

    private job: ScheduledTask | null = null;
    private caches: CacheMap = {
        [EventType.Boss]: new BossCache(),
        [EventType.Race]: new RaceCache(),
        [EventType.CT]: new CTCache(),
        [EventType.Collection]: new CollectionCache(),
        [EventType.Odyssey]: new OdysseyCache()
    };

    public async start(): Promise<void> {

        this.job = cron.schedule("0, 30 * * * *", async () => {
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
            await this.runLeaderboardChecks();
        } catch (error) {
            console.error("Event Cycle failed", error);
        }
    }


    private async runEventChecks(firstUse: boolean = false): Promise<void> {

        const results = await Promise.allSettled(
            Object.values(this.caches).map((cache) => cache.check(firstUse))
        );

        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason);
            }
        }
    }

    private async runLeaderboardChecks(): Promise<void> {

        const results = await Promise.allSettled([
            this.bossLB(),
            this.raceLB(),
            this.ctLB()
        ]);
    }

    private async bossLB() {
        const bossCache = this.getEventCache(EventType.Boss).getCache();
    }

    private async raceLB() {
        const raceCache = this.getEventCache(EventType.Race).getCache();
    }

    private async ctLB() {
        const ctCache = this.getEventCache(EventType.CT).getCache();
    }
}

export const eventManager = new EventManager();
