import { getData } from "../../../api/wrapper";
import { Leaderboard, LeaderboardBody } from "../../../utils/types";
import { gsc } from "../../bucket/gsc.client";

export abstract class BaseLeaderboardUploader {

    protected abstract baseURL: string;

    protected async uploadToBucket() {
        await gsc.write();
    }

    public async check() {
        return;
    }


    protected async getAllPages(baseUrl: string): Promise<LeaderboardBody[]> {

        let page = 1;
        const allEntries: LeaderboardBody[] = [];

        while (true) {
            try {
                const data = await getData<Leaderboard>(`${baseUrl}?page=${page}`);
                if (!data?.body || data.body.length === 0 || data.success === false) break;
                
                allEntries.push(...data.body);
                page++;
            } catch {
                break;
            }
        }
        return allEntries;
    }

    protected async upload(path: string, data: unknown): Promise<void> {
        await this.gsc.write(path, data)
    }
}
