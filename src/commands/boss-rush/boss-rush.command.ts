import { SlashCommandBuilder } from "discord.js";
import { BossRushProfile } from "./boss-rush.profile";
import { BaseCommand } from "@commands/base.btd6-command";
import { 
  Announcement, 
  BossRushResult, 
  EventBody, 
  EventCacheEntry, 
  EventType 
} from "@btd6";
import { Command } from "@discord";


export type BossRushProps = EventCacheEntry<EventBody, BossRushResult>;

@Command({
  description: "Show Boss Rush Event Data",
  autoComplete: true
})
export class BossRushCommand extends BaseCommand<EventBody, BossRushResult> {

  protected readonly eventType = EventType.BossRush;
  protected readonly urlKey = EventType.BossRush;

  public commandData = new SlashCommandBuilder();

  protected getIdentity(data: EventBody): string {
    return data.id;
  }

  public buildAnnouncement(eventProps: BossRushProps["currentEvent"]): Announcement {
    return {
      eventBody: eventProps.data,
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
