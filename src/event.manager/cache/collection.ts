import { getData } from "../../api/wrapper";
import { collectionProfile, InstaSchedule } from "../../commands/collection/collection.profile";
import { URLS } from "../../utils/assets";
import { EventBody, NkData } from "../../utils/types";
import { BaseEventCache, EventType } from "./base";

export class CollectionCache extends BaseEventCache<EventBody, InstaSchedule> {

    protected eventType = EventType.Collection;
    protected url = URLS.Events; // only place available for collectionevent

    protected async getEventData(): Promise<EventBody[]> {
        
        const data = await getData<NkData<EventBody>>(URLS.Events.base);
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
}