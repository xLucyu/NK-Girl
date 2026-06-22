import { 
    ApplicationIntegrationType,
    ChatInputCommandInteraction,
    InteractionContextType, 
    SlashCommandBuilder 
} from "discord.js";
import { JSX } from "react";
import { EventBody, EventType, InstaSchedule } from "@utils";
import { BaseCommand } from "../base.command";
import { ComponentState, CreateComponentState } from "@components";
import { CurrentEventData, EventCacheEntry, eventManager } from "@manager";
import { CollectionProfile } from "./collection.profile";

export type CollectionProps = EventCacheEntry<EventBody, InstaSchedule>;


export class CollectionCommand extends BaseCommand<EventBody, InstaSchedule> {

    public commandData = new SlashCommandBuilder()
        .setName("collection")
        .setDescription("shows the collection event data.")
        .setIntegrationTypes(
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
        )
        .setContexts(
        InteractionContextType.Guild,
        InteractionContextType.PrivateChannel
        )

    public getProfile(event: CurrentEventData<EventBody, InstaSchedule>): JSX.Element {

        return CollectionProfile({
            event: event.data,
            metaData: event.metaData
        });
    }

    public getEventProps(): CollectionProps | null {
        return eventManager.getEventCache(EventType.Collection).getCache();
    }

    protected getInitialState(interaction: ChatInputCommandInteraction, eventProps: CollectionProps): ComponentState {

        return CreateComponentState({
            eventId: eventProps.currentEvent.data.id,
            difficulty: null,
            userId : interaction.user.id
        })
    }
}
