import { 
    ApplicationIntegrationType,
    ChatInputCommandInteraction,
    InteractionContextType, 
    InteractionReplyOptions, 
    SlashCommandBuilder 
} from "discord.js";
import { JSX } from "react";
import { 
    EventType, 
    GOOGLE_API_ULRS, 
    MetaBody, 
    RaceBody, 
    splitUppercase 
} from "@utils";
import { BaseCommand } from "../base.command";
import { BuildSelectMenu, ComponentState, CreateComponentState } from "@components";
import { EventCacheEntry, eventManager } from "@manager";
import { RaceProfile } from "./race.profile";
import { getData } from "../../api/api-client";

export type RaceProps = EventCacheEntry<RaceBody, MetaBody>;


export class RaceCommand extends BaseCommand<RaceBody, MetaBody> {

    public commandData = new SlashCommandBuilder()
        .setName("race")
        .setDescription("shows the Race event data.")
        .setIntegrationTypes(
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
        )
        .setContexts(
        InteractionContextType.Guild,
        InteractionContextType.PrivateChannel
        )
  

    public getProfile(event: RaceProps["currentEvent"]): JSX.Element {

        return RaceProfile({
            event: event.data,
            metaData: event.metaData
        });
    }
  

    public getEventProps(): RaceProps | null {
        return eventManager.getEventCache(EventType.Race).getCache();
    }
  

    protected getInitialState(interaction: ChatInputCommandInteraction, eventProps: RaceProps): ComponentState {

        return CreateComponentState({
            eventId: eventProps.currentEvent.data.id,
            difficulty: null,
            userId : interaction.user.id
        })
    }
  

    public getComponents(eventProps: RaceProps, state: ComponentState): InteractionReplyOptions["components"] {
    
        return [
            BuildSelectMenu({
                customId: "Race:Select",
                placeholder: "Choose a Race Event",
                options: [
                    ...eventProps.previousEvents!.map((event) => ({
                    label: splitUppercase(event.name),
                    value: event.id,
                    default: state.eventId === event.id,
                    emoji: { id: "1338550202889404487", name: "BossChallenge" }
                    }))
                ]
            })
        ]
    }

    
    protected async fetchOtherEvent(eventId: string): Promise<RaceProps["currentEvent"]> {
    
        const eventUrl = GOOGLE_API_ULRS.Race.replace("{}", eventId);
        return getData<RaceProps["currentEvent"]>(eventUrl);
    }
    
    
    public async resolveEvent(eventProps: RaceProps, state: ComponentState): Promise<RaceProps["currentEvent"]> {

        if (state.eventId === eventProps.currentEvent.data.id) {
          return eventProps.currentEvent;
        }
    
        return this.fetchOtherEvent(state.eventId);
    }
}
