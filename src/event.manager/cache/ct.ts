import { getData } from "../../api/wrapper";
import { URLS } from "../../utils/assets";
import { getNumberForEvent } from "../../utils/helpers/event.number";
import { CTBody, NkData, TileCode } from "../../utils/types";
import { BaseEventCache, EventType } from "./base";

export class CTCache extends BaseEventCache<CTBody, Record<string, TileCode>> {

    protected eventType: EventType = EventType.CT;

    protected async getEventData(): Promise<CTBody[]> {

        const data = await getData<NkData<CTBody>>(URLS.Race.base);
        return data.body;
    }

  
    protected getCurrentActiveEvent(events: CTBody[], now: number, firstUse: boolean): CTBody {
    
        let currentEvent: CTBody | undefined;
        
        if (firstUse) {
            currentEvent = events[0];
        } else {
            currentEvent = events.find((event) => event.end > now);
        }

        if (!currentEvent) throw new Error();
        return currentEvent;
    }

  
    protected async getMetaData(event: CTBody): Promise<Record<string, TileCode>> {
        
        const eventNumber = getNumberForEvent(event.start, EventType.CT);
        const url = `${URLS.Tile.base}/${eventNumber}/${URLS.Tile.extension}`;
        const data = await getData<Record<string,TileCode>>(url);
        return data;
    }

  
    protected getPreviousEventIds(events: CTBody[]): string[] | null {
        return events.map((event) => event.id);
    }
}
