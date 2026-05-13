import { gsc } from "@manager/bucket";
import { EventType } from "..";

export interface Payload<T> {
    path: string;
    data: T
} 


export abstract class BaseLeaderboardService<T, P> {

    public abstract readonly eventType: EventType;

    async check(event: T): Promise<void> {
        const jobs = await this.formatLeaderboard(event);
        console.log(jobs);
        await Promise.all(jobs.map((job) => this.uploadToBucket(job.path, job.data)));

    }

    
    async uploadToBucket(path: string, data: P) {
        await gsc.write(path, data)
    }


    protected abstract formatLeaderboard(data: T): Promise<Payload<P>[]>;
    
}