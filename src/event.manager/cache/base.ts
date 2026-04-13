import { BaseBody, EventBody } from "../../types";

export interface CurrentEventData<T, K> {
  data: T;
  metaData?: Record<string, K> | null;
}

export interface EventCacheEntry<T, K> {
  currentEvent: CurrentEventData<T, K>;
  previousEvents: string[] | null;
}

export abstract class BaseEventCache<T extends (BaseBody | EventBody),K = never> {

  protected cache: EventCacheEntry<T, K> | null = null;

  protected async getPreviousEventIds(event: T): Promise<string[] | null> {
    return null;
  }

  async check(): Promise<void> {

    const now = Date.now();
    const currentEvent = await this.getCurrentActiveEvent(now);

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) {
      return;
    }

    const metaData = await this.getMetaData(currentEvent);
    const previousEvents = await this.getPreviousEventIds(currentEvent);

    this.cache = {
      currentEvent: {
        data: currentEvent,
        metaData,
      },
      previousEvents,
    };
  }

  protected abstract getCurrentActiveEvent(now: number): Promise<T>;

  protected abstract getMetaData(event: T): Promise<Record<string, K> | null>;
  
}
