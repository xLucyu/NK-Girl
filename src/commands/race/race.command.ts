import { InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { RaceProfile } from "./race.profile";
import { 
  Announcement,
  type CurrentEventData, 
  EventCacheEntry, 
  type PreviousEvent 
} from "@manager";
import { 
  EventType, 
  addUnderscore, 
  splitUppercase, 
  type MetaBody, 
  type RaceBody, 
} from "@utils";
import { BuildSelectMenu, ComponentState } from "@components";

export type RaceProps = EventCacheEntry<RaceBody, MetaBody>;

export class RaceCommand extends BaseCommand<RaceBody, MetaBody> {

	protected readonly eventType = EventType.Race;
	protected readonly urlKey = EventType.Race;

	public commandData = BaseCommand.baseSlashCommand("race", "Show Race Event Data.", true)

	public getProfile(event: RaceProps["currentEvent"]): JSX.Element {
		return RaceProfile({
			event: event.data,
			metaData: event.metaData
		})
	}

  protected getIdentity(data: RaceBody): string {
    return data.name;
  }

  public buildAnnouncement(eventProps: RaceProps["currentEvent"]): Announcement {
    return {
      event: eventProps.data,
      profiles: [
        RaceProfile({
          event: eventProps.data,
          metaData: eventProps.metaData
        })
      ]
    };
  }

	public getComponents(
    _event: CurrentEventData<RaceBody, MetaBody>, 
    state: ComponentState,
    previousEvents: PreviousEvent[]
  ): InteractionReplyOptions["components"] {
		return [
			BuildSelectMenu({
				customId: "race:eventId:Select",
				placeholder: "Choose a Race Event",
				options: previousEvents.map((event) => ({
					label: splitUppercase(event.name),
					value: addUnderscore(event.name),
					default: addUnderscore(state.event) === addUnderscore(event.name),
					emoji: "Race" 
				})),
			}),
		];
	}
}
