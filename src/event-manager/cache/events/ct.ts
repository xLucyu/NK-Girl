import { getData } from "../../../api/api-client";
import { 
    API_URLS, 
    getNumberForEvent,
    CTBody,
    EventType,
    TileCode
} from "@utils";
import { BaseEventCache } from "./base";


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

    protected getBucketPath(event: CTBody): string {
        return `Event/CT/${event.id}/event.json`;
    }
}
