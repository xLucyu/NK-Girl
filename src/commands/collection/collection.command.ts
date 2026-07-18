import { EventBody, EventType, InstaSchedule } from "@utils";
import { BaseCommand } from "../base.command";
import { CollectionProfile } from "./collection.profile";
import { EventCacheEntry, eventManager } from "@manager";

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;

export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

  protected readonly eventType = EventType.Collection;
  protected readonly urlKey = EventType.Collection;

  public commandData = BaseCommand.baseSlashCommand("collection", "Show Collection Event Data.");

  public getProfile(event: CollectionProps["currentEvent"]): JSX.Element {
    return CollectionProfile({
      event: event.data,
      metaData: event.metaData
    })
  }

  public getEventProps(): CollectionProps | null {
    return eventManager.getEventCache(EventType.Collection).getCache();
  }
}