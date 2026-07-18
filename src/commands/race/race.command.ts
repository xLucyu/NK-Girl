import { InteractionReplyOptions } from "discord.js";
import { EventCacheEntry } from "@manager";
import { EventType, MetaBody, RaceBody, splitUppercase } from "@utils";
import { BaseCommand } from "../base.command";
import { RaceProfile } from "./race.profile";
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

	public getComponents(eventProps: RaceProps, state: ComponentState): InteractionReplyOptions["components"] {
		return [
			BuildSelectMenu({
				customId: "Race:Select",
				placeholder: "Choose a Race Event",
				options: eventProps.previousEvents!.map((event) => ({
					label: splitUppercase(event.name),
					value: event.id,
					default: state.eventId === event.id,
					emoji: { id: "1338550190390382694", name: "EventRace" }
				})),
			}),
		];
	}
}