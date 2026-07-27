import { BaseCommand } from "../base.command";
import { CollectionProfile } from "./collection.profile";
import { EventCacheEntry } from "@manager";
import { 
  EventType, 
  type EventBody, 
  type InstaSchedule 
} from "@utils";

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;

export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

  protected readonly eventType = EventType.Collection;
  protected readonly urlKey = EventType.Collection;

  public commandData = BaseCommand.baseSlashCommand("collection", "Show Collection Event Data.", true);

  public getProfile(event: CollectionProps["currentEvent"]): JSX.Element {
    return CollectionProfile({
      event: event.data,
      metaData: event.metaData,
      page: 0
    })
  }
}
