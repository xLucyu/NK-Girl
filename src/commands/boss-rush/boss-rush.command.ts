import { BaseCommand } from "../base.command";
import { BossRushProfile } from "./boss-rush.profile";
import { EventCacheEntry } from "@manager";
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

  public getProfile(event: BossRushProps["currentEvent"], state: ComponentState): JSX.Element {
    return BossRushProfile();
  }
}