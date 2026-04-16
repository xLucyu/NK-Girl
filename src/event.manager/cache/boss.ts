import { BossBody, MetaData, NkData } from "../../utils/types";
import { BaseEventCache } from "./base";
import { getData } from "../../api/wrapper";
import { URLS, BOSSDIFFICULTIES, BossDifficulty } from "../../utils/assets";

export class BossCache extends BaseEventCache<BossBody, MetaData> {

    protected async getEventData(): Promise<BossBody[]> {

       const data = await getData<NkData<BossBody>>(URLS.Boss.base)
       return data.body 
    }

    protected getCurrentActiveEvent(events: BossBody[], now: number): BossBody {

        const currentEvent = events.find((event) => event.end > now);

        if (!currentEvent) throw new Error();
        return currentEvent;
    }

    protected async getMetaData(event: BossBody): Promise<Record<BossDifficulty, MetaData> | null | undefined> {

        const entries = await Promise.all(
            BOSSDIFFICULTIES.map(async (difficulty) => {
                const url = difficulty === "Standard"
                    ? event.metadataStandard
                    : event.metadataElite;
                const data = await getData<MetaData>(url);
                return [difficulty, data] as const;
            })
        )
        return Object.fromEntries(entries) as Record<BossDifficulty, MetaData>;
    }
}
