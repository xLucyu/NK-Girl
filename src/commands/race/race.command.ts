import { InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { RaceProfile } from "./race.profile";
import { EventCacheEntry } from "@manager";
import { BuildSelectMenu, ComponentState } from "@components";
import { 
  EventType, 
  addUnderscore, 
  splitUppercase, 
  type MetaBody, 
  type RaceBody, 
} from "@utils";

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

	public getComponents(eventProps: RaceProps, state: ComponentState): InteractionReplyOptions["components"] {
		return [
			BuildSelectMenu({
				customId: "race:eventId:Select",
				placeholder: "Choose a Race Event",
				options: eventProps.previousEvents!.map((event) => ({
					label: splitUppercase(event.name),
					value: addUnderscore(event.name),
					default: addUnderscore(state.event) === addUnderscore(event.name),
					emoji: { id: "1338550190390382694", name: "EventRace" }
				})),
			}),
		];
	}
}
