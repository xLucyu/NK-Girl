import { getData } from "@wrapper";
import { API_URLS } from "@utils/assets";
import { MetaBody, MetaData, RaceBody } from "@utils/types";
import { BaseEventCache, EventType } from "./base";

export class RaceCache extends BaseEventCache<RaceBody, MetaBody> {

    protected eventType: EventType = EventType.Race;
    protected url = API_URLS.Race;

    protected getCurrentActiveEvent(events: RaceBody[], now: number, firstUse: boolean): RaceBody {

        let currentEvent: RaceBody | undefined;
        
        if (firstUse) {
            currentEvent = events[1];
        } else {
            currentEvent = events.find((event) => event.end > now);
        }

        if (!currentEvent) throw new Error();
        return currentEvent;
    }

    
    protected async getMetaData(event: RaceBody): Promise<MetaBody> {
        
        const data = await getData<MetaData>(event.metadata);
        return data.body as MetaBody;
    }

    protected getBucketPath(event: RaceBody): string {
        return `Event/Race/${event.id}/event.json`;
    }
}
