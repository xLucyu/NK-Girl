import { BaseEventCache, PreviousEvent } from "./events.cache.base";
import { 
  EventBody, 
  EventType, 
  InstaSchedule, 
  NKData 
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { getData } from "@lib";
import { getCollectionCycle } from "@btd6/helpers";


export class CollectionCache extends BaseEventCache<EventBody, InstaSchedule> {

  protected eventType = EventType.Collection;
  protected url = API_URLS.Events; // only place available for collection

  protected async getEventData(): Promise<EventBody[]> {
      
    const data = await getData<NKData<EventBody>>(this.url);
    return data.body;
  }

  protected override getCurrentEvent(events: EventBody[], now: number, getLatest = false): EventBody | undefined {
    return super.getCurrentEvent(
      events.filter(event => event.type === "collectableEvent"),
      now,
      getLatest
    )     
  }

  protected async getMetaData(event: EventBody): Promise<InstaSchedule> {
    return getCollectionCycle(event);
  }

  protected override getPreviousEvents(): PreviousEvent[] {
    return [];
  }

  public getBucketPath(event: EventBody): string {
    return `Event/Collection/${event.id}/event.json`;
  }
}