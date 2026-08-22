import { 
  ButtonStyle, 
  ChatInputCommandInteraction, 
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { BaseCommand } from "@commands/base.btd6-command";
import { OdysseyProfile } from "./odyssey.profile";
import { 
  CurrentEventData, 
  EventCacheEntry, 
  EventType, 
  MetaBody, 
  OdysseyBody, 
  OdysseyDifficulties, 
  OdysseyDifficulty, 
  OdysseyMetaData, 
  PreviousEvent, 
  splitUppercase } from "@btd6";
import { 
  BaseOptions, 
  BuildButtonMenu, 
  BuildSelectMenu, 
  Command, 
  ComponentState 
} from "@discord";
import { addUnderscore } from "@lib";


interface OdysseyOptions extends BaseOptions {
  difficulty: string;
} 

export type OdysseyCache = Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>
export type OdysseyProps = EventCacheEntry<OdysseyBody, OdysseyCache>;

@Command({
  description: "Show Odyssey Event Data",
  autoComplete: true
})
export class OdysseyCommand extends BaseCommand<OdysseyBody, OdysseyCache> {

  protected readonly eventType = EventType.Odyssey;
  protected readonly urlKey = EventType.Odyssey;

  public commandData = new SlashCommandBuilder()
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

  public buildAnnouncement(eventProps: OdysseyProps["currentEvent"]) {
    return {
      event: eventProps.data,
      profiles: OdysseyDifficulties.map((difficulty) => 
        OdysseyProfile({
          event: eventProps.data,
          metaData: eventProps.metaData[difficulty],
          difficulty: difficulty
        })
      )
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
            emoji: "Odyssey"
          })),
        ],
      }),
    ];
  }
}
