import { EventType, BossBody, MetaBody, MetaData } from "@utils/types";
import { BaseEventCache } from "./base";
import { getData } from "@wrapper";
import { API_URLS } from "@utils/assets/constants";

export const BossDifficulties = ["Standard", "Elite"] as const;
export type BossDifficulty = typeof BossDifficulties[number];

export class BossCache extends BaseEventCache<BossBody, Record<BossDifficulty, MetaBody>> {

    protected eventType = EventType.Boss;
    protected url = API_URLS.Boss;

    
    protected getCurrentActiveEvent(events: BossBody[], now: number, firstUse: boolean): BossBody {

        let currentEvent: BossBody | undefined;
        
        if (firstUse) {
            currentEvent = events[0];
        } else {
            currentEvent = events.find((event) => event.end > now);
        }

        if (!currentEvent) throw new Error();
        return currentEvent;
    }


    protected async getMetaData(event: BossBody): Promise<Record<BossDifficulty, MetaBody>> {

        const entries = await Promise.all(
            BossDifficulties.map(async (difficulty) => {
                const url = difficulty === "Standard"
                    ? event.metadataStandard
                    : event.metadataElite;
                const data = await getData<MetaData>(url);
                return [difficulty, data.body];
            })
        )
        return Object.fromEntries(entries) as Record<BossDifficulty, MetaBody>;
    }

    protected getBucketPath(event: BossBody): string {
        return `Event/Boss/${event.id}/event.json`;
    }
}