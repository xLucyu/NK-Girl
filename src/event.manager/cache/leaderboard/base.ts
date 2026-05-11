import { getData } from "@wrapper"
import type { Leaderboard, LeaderboardBody } from "@utils/types";
import { gsc } from "@manager/bucket";

export abstract class BaseLeaderboardCache {

    protected abstract baseUrl: string;

    async check() {

        const allPages = this.getAllPages(this.baseUrl);

    }

    
    async uploadToBucket(path: string, data: unknown) {
        await gsc.write(path, data)
    }


    protected abstract getAllPages(baseUrl: string): Promise<void>
    protected abstract formatLeaderboard(data: unknown): Promise<void>
}
