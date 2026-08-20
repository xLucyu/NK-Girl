import { BaseEventCache } from "./events.cache.base";
import { getData } from "@lib/http";
import { API_URLS } from "@btd6/constants";
import {
  EventType,
  BossDifficulties,
  BossBody,
  BossDifficulty,
  MetaBody,
  MetaData
} from "@btd6/types";

export class BossCache extends BaseEventCache<BossBody,Record<BossDifficulty, MetaBody>> {

  protected readonly eventType = EventType.Boss;
  protected readonly url = API_URLS.Boss;

  protected getCurrentEvent(
    events: BossBody[],
    now: number
  ): BossBody {

    const currentEvent = events.find(
      (event) =>
        event.start <= now &&
        event.end > now
    );

    if (!currentEvent) throw new Error("No active Boss event found");
    return currentEvent;
  }

  protected async getMetaData(event: BossBody): Promise<Record<BossDifficulty, MetaBody>> {

    const entries = await Promise.all(
      BossDifficulties.map(async (difficulty) => {
        const url = difficulty === "Standard" ? event.metadataStandard : event.metadataElite;
        const data = await getData<MetaData>(url);

        return [difficulty, data.body] as const;
      })
    );

    return Object.fromEntries(entries) as Record<BossDifficulty,MetaBody>;
  }

  public getBucketPathKey(event: BossBody): string {
    return event.id;
  }
}