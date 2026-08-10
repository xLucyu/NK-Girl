import { BaseCommand } from "../base.command";
import { BossRushProfile } from "./boss-rush.profile";
import type { Announcement, EventCacheEntry } from "@manager";
import type { ComponentState } from "@components";
import { 
    type BossRushResult, 
    type EventBody, 
    EventType 
} from "@utils";

export type BossRushProps = EventCacheEntry<EventBody, BossRushResult>;

export class BossRushCommand extends BaseCommand<EventBody, BossRushResult> {

  protected readonly eventType = EventType.BossRush;
  protected readonly urlKey = EventType.BossRush;

  public commandData = BaseCommand.baseSlashCommand("boss_rush", "Show Boss Rush Event Data.", true);

  protected getIdentity(data: EventBody): string {
    return data.id;
  }

  public buildAnnouncement(eventProps: BossRushProps["currentEvent"]): Announcement {
    return {
      event: eventProps.data,
      profiles: [
        BossRushProfile({
          event: eventProps.data,
          metaData: eventProps.metaData
        })
      ]
    };
  }

  public getProfile(event: BossRushProps["currentEvent"]): JSX.Element {
    return BossRushProfile({
      event: event.data,
      metaData: event.metaData
    });
  }
}
