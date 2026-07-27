import { ButtonStyle, InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { CollectionProfile } from "./collection.profile";
import { BuildButtonMenu, ComponentState, Options } from "@components";
import { CurrentEventData, EventCacheEntry} from "@manager";
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

  protected getOptions(): Options {
    return {
      currentPage: 0
    };
  }

  public getProfile(event: CollectionProps["currentEvent"], state: ComponentState): JSX.Element {
    return CollectionProfile({
      event: event.data,
      metaData: event.metaData,
      page: state.options.currentPage ?? 0
    })
  }

  
  protected getComponents(
    event: CurrentEventData<EventBody, InstaSchedule>,
    state: ComponentState
  ): InteractionReplyOptions["components"] {
    
    const totalPages = Math.max(
      1, Math.ceil(Object.keys(event.metaData.Rotations).length / 10)
    );

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "collection:currentPage:previous",
            label: "◀",
            style: ButtonStyle.Secondary,
            disabled: state.options.currentPage! <= 0
          },
          {
            customId: "collection:currentPage:next",
            label: "▶",
            style: ButtonStyle.Secondary,
            disabled: state.options.currentPage! >= totalPages - 1
          },
        ],
      }),
    ];
  }
}
