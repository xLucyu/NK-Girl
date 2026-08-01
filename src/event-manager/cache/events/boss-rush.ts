import { API_URLS, EventBody, EventType } from "@utils";
import { BaseEventCache, PreviousEvent } from "./base";
import { BossRushResult, generateBossRush } from "../../../utils/helpers/decode.boss-rush";

export class BossRushCache extends BaseEventCache<EventBody, BossRushResult> {
  
  protected eventType = EventType.BossRush;
  protected url = API_URLS.Events; // only place for boss rush

  protected getCurrentActiveEvent(events: EventBody[], now: number, firstUse: boolean): EventBody {
        
    let currentEvent: EventBody | undefined;
    
    if (firstUse) {
      currentEvent = events.find((event) => event.type == "bossRush");
    } else {
      currentEvent = events.find((event) => event.end > now && event.type == "bossRush");
    }

    if (!currentEvent) throw new Error();
    return currentEvent;
  }

  protected async getMetaData(event: EventBody, now?: number): Promise<BossRushResult> {
    return generateBossRush(event.id);
  }

  protected override getPreviousEvents(): PreviousEvent[] {
    return [];
  }
  
  protected getBucketPath(event: EventBody): string {
    return `Event/BossRush/${event.id}/event.json`;
  }
}