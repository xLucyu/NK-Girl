import { getData } from "../../../api/api-client";
import type { NkData, BaseBody, EventType } from "@utils";
import { gsc } from "@manager";


export interface CurrentEventData<T, K> {
  data: T;
  metaData: K;
}

export interface PreviousEvent {
  id: string;
  name: string;
}

export interface EventCacheEntry<T, K> {
  eventType: EventType;
  currentEvent: CurrentEventData<T, K>;
  previousEvents: PreviousEvent[] | null;
}

export abstract class BaseEventCache<T extends BaseBody, K> {

  protected cache: EventCacheEntry<T, K> | null = null;
  protected abstract url: string;
  protected abstract eventType: EventType;

  protected async getEventData(): Promise<T[]> {

    const data = await getData<NkData<T>>(this.url);
    return data.body;
  }


  protected getPreviousEvents(events: T[]): PreviousEvent[] {

    return events.map((event) => ({
      id: event.id,
      name: event.name
    }))
  } 


  protected async uploadToBucket(bucketPath: string): Promise<void> {

    if (!this.cache) return;
    await gsc.write(bucketPath, this.cache.currentEvent);
  }


  public getCache(): EventCacheEntry<T,K> | null {
    return this.cache;
  }

  
  public async getEventById(id: string): Promise<T | null> {

    const events = await this.getEventData();
    return events.find((event) => event.id === id) ?? null;
  }


  async check(firstUse: boolean): Promise<void> {

    const now = Date.now(); // get date time

    const events = await this.getEventData(); // get the the event body

    const currentEvent = this.getCurrentActiveEvent(events, now, firstUse); // get the ongoing event

    if (this.cache && this.cache.currentEvent.data.id === currentEvent.id) return;

    const metaData = await this.getMetaData(currentEvent); // get meta data for the event

    const previousEvents = this.getPreviousEvents(events);

    this.cache = {
      eventType: this.eventType,
      currentEvent: {
        data: currentEvent,
        metaData: metaData
      },
      previousEvents
    }
    console.log(this.cache);

    if (!firstUse) {
      const bucketPath = this.getBucketPath(currentEvent);
      await this.uploadToBucket(bucketPath);
    }
  }

  protected abstract getCurrentActiveEvent(events: T[], now: number, firstUse: boolean): T;
  protected abstract getMetaData(event: T, now?: number): Promise<K>;
  protected abstract getBucketPath(event: T): string;
}
