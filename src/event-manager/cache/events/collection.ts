import { getData } from "@wrapper";
import { collectionProfile, InstaSchedule } from "@commands/collection/collection.profile";
import { API_URLS } from "@utils/assets/constants";
import { EventBody, EventType, NkData } from "@utils/types";
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
        return collectionProfile(event);
    }

    protected override getPreviousEvents(): null {
        return null;
    }

    protected getBucketPath(event: EventBody): string {
        return `Event/Collection/${event.id}/event.json`;
    }
}
