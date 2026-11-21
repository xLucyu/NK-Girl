import { ButtonStyle, InteractionReplyOptions, SlashCommandBuilder } from "discord.js";
import { BuildButtonMenu, BuildSelectMenu, Command, ComponentState } from "@discord";
import { RaceProfile } from "./race.profile";
import { 
  Announcement,
  CurrentEventData, 
  EventCacheEntry, 
  EventType, 
  getNumberForEvent,
  MetaBody,
  PreviousEvent, 
  RaceBody 
} from "@btd6";
import { splitUppercase } from "@btd6/helpers/format";
import { BaseCommand } from "@commands/base.btd6-command";
import { DisabledTowersProfile } from "@ui";
import { addUnderscore } from "@lib";

export type RaceProps = EventCacheEntry<RaceBody, MetaBody>;

@Command({
  description: "Show Race Event Data",
  autoComplete: true 
})
export class RaceCommand extends BaseCommand<RaceBody, MetaBody> {

  protected readonly eventType = EventType.Race;
  protected readonly urlKey = EventType.Race;

  public commandData = new SlashCommandBuilder();

  public getProfile(event: CurrentEventData<RaceBody, MetaBody>, state: ComponentState): JSX.Element {
    if (state.options.view === "disabled") {
      return DisabledTowersProfile({
        eventType: `Race #${getNumberForEvent(event.data.start, EventType.Race)}`,
        eventName: splitUppercase(event.data.name),
        towers: event.metaData._towers
      });
    }

    return RaceProfile({
      event: event.data,
      metaData: event.metaData
    })
  }

  protected getIdentity(data: RaceBody): string {
    return data.name;
  }

  public buildAnnouncement(event: RaceProps["currentEvent"]): Announcement {
    return {
      eventBody: event.data,
      profiles: [
        {
          cacheKey: this.createProfileCacheKey(event.data),
          profile: RaceProfile({
            event: event.data,
            metaData: event.metaData
          })
        }
      ]
    };
  }

  protected getComponents(
    _event: CurrentEventData<RaceBody, MetaBody>,
    state: ComponentState,
    previousEvents: PreviousEvent[]
  ): InteractionReplyOptions["components"] {

    return [
      BuildButtonMenu({
        buttons: [{
          label: state.options.view === "disabled" ? "Full Event" : "Disabled Towers",
          customId: `race:view:${state.options.view === "disabled" ? "full" : "disabled"}`,
          style: state.options.view === "disabled" ? ButtonStyle.Primary : ButtonStyle.Secondary
        }]
      }),
      BuildSelectMenu({
        customId: "race:eventId:Select",
        placeholder: "Choose a Race Event",
        options: previousEvents.map(event => ({
          label: splitUppercase(event.name),
          value: addUnderscore(event.name),
          default: addUnderscore(state.event) === addUnderscore(event.name),
          emoji: "Race"
        }))
      })
    ];
  }
}