import { BaseBody, EventBody } from "../../utils/types";

export interface CurrentEventData<T, K> {
  data: T;
  metaData?: Record<string, K> | null;
}

export interface EventCacheEntry<T, K> {
  currentEvent: CurrentEventData<T, K>;
  previousEvents: string[] | null;
}

export abstract class BaseEventCache<T extends (BaseBody | EventBody), K = never> {

  protected cache: EventCacheEntry<T, K> | null = null;

  protected getPreviousEventIds(events: T[]): string[] | null {
    return null;
  }

  protected abstract getEventData(): Promise<T[]>;
  protected abstract getCurrentActiveEvent(events: T[], now: number): T;
  protected abstract getMetaData(event: T): Promise<Record<string, K> | null | undefined>;

  async check(): Promise<void> {

    const now = Date.now(); // get date time

    const events = await this.getEventData(); // get the the event body

    const currentEvent = this.getCurrentActiveEvent(events, now); // get the ongoing event

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) return;

    const metaData = await this.getMetaData(currentEvent); // get meta data for the event, if present 

    const previousEvents = this.getPreviousEventIds(events); // get previous events for later select menu

    this.cache = {
      currentEvent: {
        data: currentEvent,
        metaData: metaData ?? null 
      },
      previousEvents
    }
  }
}