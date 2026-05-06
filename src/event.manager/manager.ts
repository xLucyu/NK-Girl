import cron, { ScheduledTask } from "node-cron";
import { 
    BossCache,
    RaceCache,
    OdysseyCache,
    CollectionCache,
    CTCache
} from "./cache";
import { EventType } from "./cache/base";

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

        this.job = cron.schedule("0 * * * *", async () => {
            await this.runChecks();
        });

        await this.runChecks(true);
    }

    public getEventCache<T extends EventType>(mode: T): CacheMap[T] {
        return this.caches[mode];
    }


    private async runChecks(firstUse: boolean = false): Promise<void> {

        if (!this.job) return;

        const results = await Promise.allSettled(
            Object.values(this.caches).map((cache) => cache.check(firstUse))
        );

        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason);
            }
        }
    }
}

export const eventManager = new EventManager();
