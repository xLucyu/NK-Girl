import { getData } from "../../api/wrapper";
import { EventURLs } from "../../utils/assets";
import type { NkData, BaseBody } from "../../utils/types";

export enum EventType {
  Boss = "Boss",
  Race = "Race",
  Odyssey = "Odyssey",
  Collection = "Collection",
  CT = "CT"
}

interface CurrentEventData<T, K> {
  data: T;
  metaData?: K | null;
}

interface PreviousEvent {
  id: string;
  name: string;
}

export interface EventCacheEntry<T, K> {
  eventType: EventType;
  currentEvent: CurrentEventData<T, K>;
  previousEvents: PreviousEvent[] | null;
}

export abstract class BaseEventCache<T extends BaseBody, K = never> {

  public cache: EventCacheEntry<T, K> | null = null;
  protected abstract url: EventURLs;
  protected abstract eventType: EventType;

  protected async getEventData(): Promise<T[]> {

    const data = await getData<NkData<T>>(this.url.base);
    return data.body;
  }

  protected getPreviousEvents(events: T[]): PreviousEvent[] | null {
    return events.map((event) => ({
      id: event.id,
      name: event.name
    }))
  } 
  

  async check(firstUse: boolean): Promise<void> {

    const now = Date.now(); // get date time

    const events = await this.getEventData(); // get the the event body

    const currentEvent = this.getCurrentActiveEvent(events, now, firstUse); // get the ongoing event

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) return;

    const metaData = await this.getMetaData(currentEvent); // get meta data for the event, if present 

    const previousEvents = this.getPreviousEvents(events);

    this.cache = {
      eventType: this.eventType,
      currentEvent: {
        data: currentEvent,
        metaData: metaData ?? null 
      },
      previousEvents
    }
    console.log(this.cache)
  }

  protected abstract getCurrentActiveEvent(events: T[], now: number, firstUse: boolean): T;
  protected abstract getMetaData(event: T, now?: number): Promise<K>;
}
