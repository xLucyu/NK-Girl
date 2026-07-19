import { 
  ButtonStyle, 
  ChatInputCommandInteraction, 
  InteractionReplyOptions, 
} from "discord.js";
import { 
  EventType,
  MetaBody, 
  OdysseyBody, 
  OdysseyDifficulties, 
  OdysseyDifficulty, 
  OdysseyMetaData, 
  splitUppercase
} from "@utils";
import { BaseCommand } from "../base.command";
import { type EventCacheEntry } from "@manager";
import { 
  BuildButtonMenu, 
  BuildSelectMenu, 
  ComponentState,
  Options
} from "@components";
import { OdysseyProfile } from "./odyssey.profile";

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

  protected getOptions(interaction: ChatInputCommandInteraction): Options {
    return {
      difficulty: interaction.options.getString("difficulty") ?? OdysseyDifficulties[2]
    };
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

  public getComponents(eventProps: EventCacheEntry<OdysseyBody, OdysseyCache>, state: ComponentState): InteractionReplyOptions["components"] {
    
    return [

      BuildButtonMenu({
        buttons: OdysseyDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `Odyssey:${difficulty}`,
          style: difficulty === "Hard" ? ButtonStyle.Danger 
            : difficulty === "Medium" ? ButtonStyle.Success 
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
}
