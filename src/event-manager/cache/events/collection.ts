import { getData } from "@wrapper";
import { 
    getCollectionCycle,
    InstaSchedule, 
    EventBody,
    EventType,
    API_URLS,
    NkData
} from "@utils";
import { BaseEventCache } from "./base";

export class CollectionCache extends BaseEventCache<EventBody, InstaSchedule> {

    protected eventType = EventType.Collection;
    protected url = API_URLS.Events; // only place available for collection

    protected async getEventData(): Promise<EventBody[]> {
        
        const data = await getData<NkData<EventBody>>(this.url);
        return data.body;
    }

    protected getCurrentActiveEvent(events: EventBody[], now: number, firstUse: boolean): EventBody {
        
        let currentEvent: EventBody | undefined;
        
        if (firstUse) {
            currentEvent = events.find((event) => event.type == "collectableEvent");
        } else {
            currentEvent = events.find((event) => event.end > now && event.type == "collectableEvent");
        }

        if (!currentEvent) throw new Error();
        return currentEvent;
    }

    protected async getMetaData(event: EventBody): Promise<InstaSchedule> {
        return getCollectionCycle(event);
    }

    protected override getPreviousEvents(): null {
        return null;
    }

    protected getBucketPath(event: EventBody): string {
        return `Event/Collection/${event.id}/event.json`;
    }
}