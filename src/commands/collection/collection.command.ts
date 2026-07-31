import { ButtonStyle, InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { CollectionProfile } from "./collection.profile";
import { BuildButtonMenu, ComponentState, BaseOptions } from "@components";
import { CurrentEventData, EventCacheEntry} from "@manager";
import { 
  EventType, 
  type EventBody, 
  type InstaSchedule 
} from "@utils";

interface CollectionOptions extends BaseOptions {
  currentPage: number;
}

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;

export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

  protected readonly eventType = EventType.Collection;
  protected readonly urlKey = EventType.Collection;

  public commandData = BaseCommand.baseSlashCommand("collection", "Show Collection Event Data.", true);

  protected getOptions(): CollectionOptions {
    return {
      currentPage: 0
    };
  }

  protected getIdentity(data: EventBody): string {
    return data.id;
  }

  public getProfile(event: CollectionProps["currentEvent"], state: ComponentState): JSX.Element {

    const options = state.options as CollectionOptions;

    return CollectionProfile({
      event: event.data,
      metaData: event.metaData,
      page: options.currentPage ?? 0
    })
  }

  
  protected getComponents(
    event: CurrentEventData<EventBody, InstaSchedule>,
    state: ComponentState
  ): InteractionReplyOptions["components"] {

    const options = state.options as CollectionOptions;
    const totalPages = Math.max(
      1, Math.ceil(Object.keys(event.metaData.Rotations).length / 10)
    );

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "collection:page:previous",
            label: "◀",
            style: ButtonStyle.Secondary,
            disabled: options.currentPage! <= 0
          },
          {
            customId: "collection:page:next",
            label: "▶",
            style: ButtonStyle.Secondary,
            disabled: options.currentPage! >= totalPages - 1
          },
        ],
      }),
    ];
  }
}
