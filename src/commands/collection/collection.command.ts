import { 
  ButtonStyle,
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { BaseCommand } from "@commands/base.btd6-command";
import { CollectionProfile } from "./collection.profile";
import { 
  Announcement, 
  CurrentEventData, 
  EventBody, 
  EventCacheEntry, 
  EventType, 
  InstaSchedule 
} from "@btd6";
import { 
  BaseOptions, 
  BuildButtonMenu, 
  Command, 
  ComponentState 
} from "@discord";


const PAGE_SIZE = 10;

interface CollectionOptions extends BaseOptions {
  offset: number;
  pageSize: number;
  total: number;
}

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;

@Command({
  description: "Look up Collection Event Data",
  autoComplete: true
})
export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

  protected readonly eventType = EventType.Collection;
  protected readonly urlKey = EventType.Collection;

  public commandData = new SlashCommandBuilder();

  protected getOptions(): CollectionOptions {
    return { offset: 0, pageSize: PAGE_SIZE, total: 0 };
  }

  protected getIdentity(data: EventBody): string {
    return data.id;
  }

  public buildAnnouncement(eventProps: CollectionProps["currentEvent"]): Announcement {

    const total = Object.keys(eventProps.metaData.Rotations).length;
    const pageCount = Math.ceil(total / PAGE_SIZE);

    return {
      eventBody: eventProps.data,
      profiles:
        Array.from(
          { length: pageCount },
          (_, page) => 
            CollectionProfile({
              event: eventProps.data,
              metaData: eventProps.metaData,
              offset: page * PAGE_SIZE
            })
        )
    };
  }

  public getProfile(
    event: CollectionProps["currentEvent"],
    state: ComponentState,
  ): JSX.Element {

    const options = state.options as CollectionOptions;

    options.total = Object.keys(event.metaData.Rotations).length;

    return CollectionProfile({
      event: event.data,
      metaData: event.metaData,
      offset: options.offset,
    });
  }

  protected getComponents(
    event: CurrentEventData<EventBody, InstaSchedule>,
    state: ComponentState,
  ): InteractionReplyOptions["components"] {

    const options = state.options as CollectionOptions;
    options.total = Object.keys(event.metaData.Rotations).length;

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "collection:page:previous",
            label: "◀",
            style: ButtonStyle.Secondary,
            disabled: options.offset === 0,
          },
          {
            customId: "collection:page:next",
            label: "▶",
            style: ButtonStyle.Secondary,
            disabled: options.offset + options.pageSize >= options.total
          },
        ],
      }),
    ];
  }
}