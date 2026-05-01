import cron, { ScheduledTask } from "node-cron";
import { 
    BossCache,
    RaceCache,
    OdysseyCache,
    CollectionCache,
    CTCache
} from "./cache";

type EventCaches = {
    Boss: BossCache;
    Race: RaceCache;
    Odyssey: OdysseyCache;
    Collection: CollectionCache;
    CT: CTCache;
}

export class EventManager {

    private job: ScheduledTask | null = null;

    private cache: EventCaches = {
        Boss: new BossCache(),
        Race: new RaceCache(),
        Odyssey: new OdysseyCache(),
        Collection: new CollectionCache(),
        CT: new CTCache()
    };

    
    public getCache<T extends keyof EventCaches>(eventName: T): EventCaches[T]["cache"] {
        return this.cache[eventName].cache;
    }


    public async start(): Promise<void> {

        this.job = cron.schedule("0 * * * *", async () => {
            await this.runChecks();
        });

        await this.runChecks(true);
    }


    private async runChecks(firstUse: boolean = false): Promise<void> {

        if (!this.job) return;

        const results = await Promise.allSettled(
            Object.values(this.cache).map((cache) => 
                cache.check(firstUse)
            ) 
        );

        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason);
            }
        }
    }
}

export const eventManager = new EventManager();