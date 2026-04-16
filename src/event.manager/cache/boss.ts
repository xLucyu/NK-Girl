import { BossBody, MetaData, NkData, MetaBody } from "../../utils/types";
import { BaseEventCache, EventType } from "./base";
import { getData } from "../../api/wrapper";
import { URLS } from "../../utils/assets";

export const BossDifficulties = ["Standard", "Elite"] as const;
export type BossDifficulty = typeof BossDifficulties[number];


export class BossCache extends BaseEventCache<BossBody, MetaBody> {

    protected eventType: EventType = EventType.Boss;

    protected async getEventData(): Promise<BossBody[]> {

       const data = await getData<NkData<BossBody>>(URLS.Boss.base)
       return data.body 
    }

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
                return [difficulty, data.body] as const;
            })
        )
        return Object.fromEntries(entries) as Record<BossDifficulty, MetaBody>;
    }

    protected getPreviousEventIds(events: BossBody[]): string[] | null {
        return events.map((event) => event.id);
    }
}