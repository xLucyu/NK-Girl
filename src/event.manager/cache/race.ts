import { getData } from "../../api/wrapper";
import { URLS } from "../../utils/assets";
import { MetaBody, MetaData, NkData, RaceBody } from "../../utils/types";
import { BaseEventCache, EventType } from "./base";

export class RaceCache extends BaseEventCache<RaceBody, MetaBody> {

    protected eventType: EventType = EventType.Race;

    protected async getEventData(): Promise<RaceBody[]> {

        const data = await getData<NkData<RaceBody>>(URLS.Race.base);
        return data.body;
    }

    protected getCurrentActiveEvent(events: RaceBody[], now: number, firstUse: boolean): RaceBody {

        let currentEvent: RaceBody | undefined;
        
        if (firstUse) {
            currentEvent = events[0];
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

    protected getPreviousEventIds(events: RaceBody[]): string[] | null {
        return events.map((event) => event.id);
    }
}
