import { getData } from "@lib";
import { NKData, type BaseBody, type EventType } from "@btd6/types";

export interface CurrentEventData<T, K> {
  data: T;
  metaData: K;
}

export interface PreviousEvent {
  id: string;
  name: string;
}

export interface EventCacheEntry<T extends BaseBody, K> {
  eventType: EventType;
  currentEvent: CurrentEventData<T, K>;
  previousEvents: PreviousEvent[];
}

export abstract class BaseEventCache<T extends BaseBody, K> {

  protected cache: EventCacheEntry<T, K> | null = null;
  protected abstract readonly eventType: EventType;
  protected abstract readonly url: string;

  protected async getEventData(): Promise<T[]> {
    
    const data = await getData<NKData<T>>(this.url);
    return data.body;
  }

  protected getPreviousEvents(events: T[]): PreviousEvent[] {
    return events.map((event) => ({
      id: event.id,
      name: event.name
    }));
  }

  public getCache(): EventCacheEntry<T, K> | null {
    return this.cache;
  }

  public async refresh(): Promise<EventCacheEntry<T, K> | null> {

    const now = Date.now();
    const events = await this.getEventData();

    const currentEvent = this.getCurrentEvent(events, now);

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) return null;

    const metaData = await this.getMetaData(currentEvent);

    this.cache = {
      eventType: this.eventType,
      currentEvent: {
        data: currentEvent,
        metaData: metaData
      },
      previousEvents: this.getPreviousEvents(events)
    };

    return this.cache;
  }

  protected abstract getCurrentEvent(events: T[], now: number): T;
  protected abstract getMetaData(event: T): Promise<K>;
}
