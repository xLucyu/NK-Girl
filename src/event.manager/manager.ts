import cron, { ScheduledTask } from "node-cron";
import { 
    BossCache,
    RaceCache,
    OdysseyCache,
    CollectionCache,
    CTCache
} from "./cache";

export class EventManager {

    private job: ScheduledTask | null = null;
    private boss: BossCache;
    private race: RaceCache;
    private odyssey: OdysseyCache;
    private collection: CollectionCache;
    private ct: CTCache;

    constructor() {
        this.boss = new BossCache();
        this.race = new RaceCache();
        this.odyssey = new OdysseyCache();
        this.collection = new CollectionCache();
        this.ct = new CTCache();
    };


    public async start(): Promise<void> {

        this.job = cron.schedule("0 * * * *", async () => {
            await this.runChecks();
        });

        await this.runChecks(true);
    }


    private async runChecks(firstUse: boolean = false): Promise<void> {

        if (!this.job) return;

        const results = await Promise.allSettled([
            this.boss.check(firstUse),
            this.race.check(firstUse),
            this.odyssey.check(firstUse),
            this.collection.check(firstUse),
            this.ct.check(firstUse)
        ]);

        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason);
            }
        }
    }
}
