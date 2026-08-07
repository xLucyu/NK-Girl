import { ButtonStyle, InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { CollectionProfile } from "./collection.profile";
import { BuildButtonMenu, ComponentState, BaseOptions } from "@components";
import { CurrentEventData, EventCacheEntry } from "@manager";
import { EventType, type EventBody, type InstaSchedule } from "@utils";

const PAGE_SIZE = 10;

interface CollectionOptions extends BaseOptions {
  offset: number;
  pageSize: number;
  total: number;
}

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;

export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

  protected readonly eventType = EventType.Collection;
  protected readonly urlKey = EventType.Collection;

  public commandData = BaseCommand.baseSlashCommand("collection", "Show Collection Event Data", true);

  protected getOptions(): CollectionOptions {
    return { offset: 0, pageSize: PAGE_SIZE, total: 0 };
  }

  protected getIdentity(data: EventBody): string {
    return data.id;
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
