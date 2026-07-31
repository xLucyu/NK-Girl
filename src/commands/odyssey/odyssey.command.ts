import { 
  ButtonStyle, 
  ChatInputCommandInteraction, 
  InteractionReplyOptions, 
} from "discord.js";
import { BaseCommand } from "../base.command";
import { OdysseyProfile } from "./odyssey.profile";
import type { CurrentEventData, EventCacheEntry, PreviousEvent } from "@manager";
import { 
  OdysseyDifficulties,
  addUnderscore,
  EventType,
  splitUppercase,
  type MetaBody,
  type OdysseyDifficulty,
  type OdysseyMetaData,
  type OdysseyBody,
} from "@utils";
import { 
  BaseOptions,
  BuildButtonMenu, 
  BuildSelectMenu, 
  type ComponentState,
} from "@components";

interface OdysseyOptions extends BaseOptions {
  difficulty: string;
} 

export type OdysseyCache = Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>
export type OdysseyProps = EventCacheEntry<OdysseyBody, OdysseyCache>;

export class OdysseyCommand extends BaseCommand<OdysseyBody, OdysseyCache> {

  protected readonly eventType = EventType.Odyssey;
  protected readonly urlKey = EventType.Odyssey;

  public commandData = BaseCommand
    .baseSlashCommand("odyssey", "Show Boss Event Data", true)
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

  protected getOptions(interaction: ChatInputCommandInteraction): OdysseyOptions {
    return {
      difficulty: interaction.options.getString("difficulty") ?? OdysseyDifficulties[2]
    };
  }

  protected getIdentity(data: OdysseyBody): string {
    return data.name;
  }

  public getProfile(eventProps: OdysseyProps["currentEvent"], state: ComponentState): JSX.Element {

    const difficulty = state.options.difficulty as OdysseyDifficulty;
  
    const event = eventProps.data;
    const metaData = eventProps.metaData[difficulty];
  
    if (!metaData) throw new Error();
  
    return OdysseyProfile({
      event,
      metaData,
      difficulty
    })
  }

  public getComponents(
    _event: CurrentEventData<OdysseyBody, OdysseyCache>, 
    state: ComponentState,
    previousEvents: PreviousEvent[]
  ): InteractionReplyOptions["components"] {
    
    return [
      BuildButtonMenu({
        buttons: OdysseyDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `odyssey:difficulty:${difficulty}`,
          style: difficulty === "Hard" ? ButtonStyle.Danger 
            : difficulty === "Medium" ? ButtonStyle.Success 
            : ButtonStyle.Primary 
        })),
      }),
        
      BuildSelectMenu({
        customId: "odyssey:eventId:Select",
        placeholder: "Choose an Odyssey Event.",
        options: [
          ...previousEvents.map((event) => ({
            label: splitUppercase(event.name),
            value: addUnderscore(event.name),
            default: state.event === event.name,
            emoji: { id: "1338551267043180635", name: "OdysseyCrewBtn" }
          })),
        ],
      }),
    ];
  }
}
