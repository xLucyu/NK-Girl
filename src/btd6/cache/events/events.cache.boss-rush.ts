import { BaseEventCache, PreviousEvent } from "./events.cache.base";
import { API_URLS } from "@btd6/constants";
import { generateBossRush } from "@btd6/helpers";
import { BossRushResult, EventBody, EventType } from "@btd6/types";

export class BossRushCache extends BaseEventCache<EventBody, BossRushResult> {
  
  protected eventType = EventType.BossRush;
  protected url = API_URLS.Events; // only place for boss rush

  protected override getCurrentEvent(events: EventBody[], now: number, getLatest = false): EventBody | undefined {

  return super.getCurrentEvent(
    events.filter(event => event.type === "bossRush"),
    now,
    getLatest
  );
}

  protected async getMetaData(event: EventBody): Promise<BossRushResult> {
    return generateBossRush(event.id);
  }

  protected override getPreviousEvents(): PreviousEvent[] {
    return [];
  }
  
  public getBucketPath(event: EventBody): string {
    return `Event/BossRush/${event.id}/event.json`;
  }
}