import { getData } from "@lib";
import { NKData, type BaseBody, type EventType } from "@btd6/types";
import { gsc } from "@btd6/storage";

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

  protected getCurrentEvent(events: T[], now: number, getLatest = false): T | undefined {

    const currentEvent = events.find(event => event.start <= now && event.end > now);
    if (currentEvent) return currentEvent;

    if (!getLatest) return undefined;

    return events
      .filter(event => event.end <= now)
      .sort((a, b) => b.end - a.end)[0];
  }

  protected getPreviousEvents(events: T[]): PreviousEvent[] {
    return events.map((event) => ({
      id: event.id,
      name: event.name
    }));
  }

  private async uploadToBucket(event: T): Promise<void> {

    if (!this.cache) return;

    const path = this.getBucketPath(event);
    await gsc.write(path, this.cache.currentEvent);
    gsc.invalidate(this.eventType, "Event");
  }

  public getCache(): EventCacheEntry<T, K> | null {
    return this.cache;
  }

  public async refresh(): Promise<EventCacheEntry<T, K> | null> {

    const now = Date.now();
    const events = await this.getEventData();
    const firstLoad = this.cache === null;

    const currentEvent = this.getCurrentEvent(events, now, this.cache === null);

    if (!currentEvent || this.cache && this.cache.currentEvent.data.id === currentEvent.id) return null;

    const metaData = await this.getMetaData(currentEvent);

    this.cache = {
      eventType: this.eventType,
      currentEvent: {
        data: currentEvent,
        metaData: metaData
      },
      previousEvents: this.getPreviousEvents(events)
    };

    console.log(this.cache);

    if (!firstLoad) await this.uploadToBucket(currentEvent);
    return this.cache;
  }

  protected abstract getMetaData(event: T): Promise<K>;
  public abstract getBucketPath(event: T): string;
}