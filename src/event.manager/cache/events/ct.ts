import { getData } from "@wrapper";
import { API_URLS } from "@utils/assets";
import { getNumberForEvent } from "@utils/helpers/event.number";
import { CTBody, TileCode } from "@utils/types";
import { BaseEventCache, EventType } from "./base";

export class CTCache extends BaseEventCache<CTBody, Record<string, TileCode>> {

    protected eventType= EventType.CT;
    protected url = API_URLS.CT;
  
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
        const url = API_URLS.Tile.replace("{}", String(eventNumber));
        const data = await getData<Record<string,TileCode>>(url);
        return data;
    }


    protected override getPreviousEvents(): null {
        return null;
    }
}
