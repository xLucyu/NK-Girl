import { 
    ApplicationIntegrationType, 
    ButtonStyle, 
    ChatInputCommandInteraction, 
    InteractionContextType, 
    InteractionReplyOptions, 
    SlashCommandBuilder 
} from "discord.js";
import { 
    EventType,
    GOOGLE_API_ULRS,
    MetaBody, 
    OdysseyBody, 
    OdysseyDifficulties, 
    OdysseyDifficulty, 
    OdysseyMetaData, 
    splitUppercase
} from "@utils";
import { BaseCommand } from "../base.command";
import { 
    CurrentEventData,
    EventCacheEntry, 
    eventManager 
} from "@manager";
import { 
    BuildButtonMenu, 
    BuildSelectMenu, 
    ComponentState, 
    CreateComponentState 
} from "@components";
import { OdysseyProfile } from "./odyssey.profile";
import { getData } from "../../api";

export type OdysseyCache = Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>
export type OdysseyProps = EventCacheEntry<OdysseyBody, OdysseyCache>;

export class OdysseyCommand extends BaseCommand<OdysseyBody, OdysseyCache> {

    public commandData = new SlashCommandBuilder()
        .setName("odyssey")
        .setDescription("show the current odyssey data.")
        .addStringOption((option) =>
            option 
            .setName("difficulty")
            .setDescription("Choose a difficulty")
            .setRequired(false)
            .addChoices(
                ...OdysseyDifficulties.map((difficulty) => ({
                name: difficulty,
                value: difficulty 
                }))
            )
        )
        .setIntegrationTypes(
            ApplicationIntegrationType.GuildInstall,
            ApplicationIntegrationType.UserInstall,
        )
        .setContexts(
            InteractionContextType.Guild,
            InteractionContextType.PrivateChannel
        )

    public getEventProps(): EventCacheEntry<OdysseyBody, OdysseyCache> | null {
        return eventManager.getEventCache(EventType.Odyssey).getCache();
    }

    protected getInitialState(interaction: ChatInputCommandInteraction, eventProps: EventCacheEntry<OdysseyBody, OdysseyCache>): ComponentState {
        
        const difficulty = interaction.options.getString("difficulty") as OdysseyDifficulty ?? OdysseyDifficulties[2];

        return CreateComponentState({
            eventId: eventProps.currentEvent.data.id,
            difficulty: difficulty,
            userId: interaction.user.id
        });
    }

    public getProfile(eventProps: OdysseyProps["currentEvent"], state: ComponentState): JSX.Element {

        const difficulty = state.difficulty as OdysseyDifficulty;
    
        const event = eventProps.data;
        const metaData = eventProps.metaData[difficulty];
    
        if (!metaData) throw new Error();
    
        return OdysseyProfile({
            event,
            metaData,
            difficulty
        })
    }

    public getComponents(eventProps: EventCacheEntry<OdysseyBody, OdysseyCache>, state: ComponentState): InteractionReplyOptions["components"] {
        
        return [

            BuildButtonMenu({
                buttons: OdysseyDifficulties.map((difficulty) => ({
                    label: difficulty,
                    customId: `Odyssey:${difficulty}`,
                    style: difficulty === "Hard" ? ButtonStyle.Danger 
                        : difficulty === "Medium" ? ButtonStyle.Secondary 
                        : ButtonStyle.Primary 
                })),
            }),
              
            BuildSelectMenu({
                customId: "Odyssey:Select",
                placeholder: "Choose an Odyssey Event.",
                options: [
                    ...eventProps.previousEvents!.map((event) => ({
                        label: splitUppercase(event.name),
                        value: event.id,
                        default: state.eventId === event.id,
                        emoji: { id: "1338551267043180635", name: "OdysseyCrewBtn" }
                    })),
                ],
            }),
        ];
    }

    protected async fetchOtherEvent(eventId: string): Promise<OdysseyProps["currentEvent"]> {

        const eventUrl = GOOGLE_API_ULRS.Odyssey.replace("{}", eventId);
        return getData<OdysseyProps["currentEvent"]>(eventUrl);
    }


    public async resolveEvent(eventProps: OdysseyProps, state: ComponentState): Promise<OdysseyProps["currentEvent"]> {
    
        if (state.eventId === eventProps.currentEvent.data.id) return eventProps.currentEvent;
        return this.fetchOtherEvent(state.eventId);
    }
}
