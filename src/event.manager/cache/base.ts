import type { BaseBody } from "../../utils/types";

export enum EventType {
  Boss = "Boss",
  Race = "Race",
  Odyssey = "Odyssey",
  Collection = "Collection",
  CT = "CT"
}

export interface CurrentEventData<T, K> {
  data: T;
  metaData?: Record<string, K> | null;
}

export interface EventCacheEntry<T, K> {
  eventType: EventType;
  currentEvent: CurrentEventData<T, K>;
  previousEvents: string[] | null;
}

export abstract class BaseEventCache<T extends BaseBody, K = never> {

  public cache: EventCacheEntry<T, K> | null = null;
  protected eventType!: EventType;

  protected abstract getEventData(): Promise<T[]>;
  protected abstract getCurrentActiveEvent(events: T[], now: number, firstUse: boolean): T;
  protected abstract getMetaData(event: T): Promise<Record<string, K>>;
  protected abstract getPreviousEventIds(events: T[]): string[] | null;

  async check(firstUse: boolean): Promise<void> {

    const now = Date.now(); // get date time

    const events = await this.getEventData(); // get the the event body

    const currentEvent = this.getCurrentActiveEvent(events, now, firstUse); // get the ongoing event

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) return;

    const metaData = await this.getMetaData(currentEvent); // get meta data for the event, if present 

    const previousEvents = this.getPreviousEventIds(events); // get previous events for later select menu

    this.cache = {
      eventType: this.eventType,
      currentEvent: {
        data: currentEvent,
        metaData: metaData ?? null 
      },
      previousEvents
    }
  }
}
