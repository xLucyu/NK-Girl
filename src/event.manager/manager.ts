import cron, { ScheduledTask } from "node-cron";
import { BossCache } from "./cache";

export class EventManager {

    private job: ScheduledTask | null = null;
    private boss: BossCache;

    constructor() {
        this.boss = new BossCache();
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
            this.boss.check(firstUse)
        ]);

        for (const result of results) {
            if (result.status === "rejected") {
                console.error()
            }
        }
    }
}
