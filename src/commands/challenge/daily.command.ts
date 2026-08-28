import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ChallengeProfile } from "./daily.profile";
import { BaseCommand } from "@commands/base.btd6-command";
import { 
  API_URLS,
  CurrentEventData, 
  DailyChallengeSetBody, 
  DailyChallengeSetMeta, 
  DailyChallengeType, 
  EventType, 
  MetaData 
} from "@btd6";
import { BaseOptions, Command, ComponentState } from "@discord";
import { getData } from "@lib";
import { render } from "@ui";

export interface ChallengeOptions extends BaseOptions {
  difficulty: DailyChallengeType;
}

@Command({
  description: "Get the daily challenge or look one up using a code",
  autoComplete: false,
})
export class ChallengeCommand extends BaseCommand<DailyChallengeSetBody, DailyChallengeSetMeta> {

  protected readonly eventType = EventType.DailyChallenge;
  protected readonly urlKey = EventType.DailyChallenge;

  public commandData = new SlashCommandBuilder()
    .addSubcommand(command =>
      command 
        .setName("daily")
        .setDescription("Show the current Daily Challenge")
        .addStringOption(option => 
          option
            .setName("difficulty")
            .setDescription("Challenge Type")
            .setRequired(false)
            .addChoices(
              { name: "Standard", value: "Standard" },
              { name: "Advanced", value: "Avanced" }
            )
        )
    )
    .addSubcommand(command =>
      command
        .setName("lookup")
        .setDescription("Look up a Challenge")
        .addStringOption(option =>
          option
            .setName("code")
            .setDescription("Challenge code")
            .setRequired(true)
        )
    );

  public override async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const subCommand = interaction.options.getSubcommand(true);

    switch (subCommand) {

      case "daily":
        return super.execute(interaction);

      case "lookup":
        return this.executeLookup(interaction);
    }
  }

  private async executeLookup(interaction: ChatInputCommandInteraction): Promise<void> {

    await interaction.deferReply();

    const code = interaction.options
      .getString("code", true)
      .trim()
      .toUpperCase();

    const response = await getData<MetaData>(`${API_URLS.Challenge}/${code}`);
    const profile = ChallengeProfile({ metaData: response.body });

    const buffer = await render(profile);

    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });

    await interaction.editReply({ files: [attachment] });
  }

  protected getIdentity(data: DailyChallengeSetBody): string {
    return data.name;
  }

  protected getOptions(interaction: ChatInputCommandInteraction): ChallengeOptions {
    return {
      difficulty: interaction.options.getString("difficulty") as DailyChallengeType ?? "Advanced" 
    };
  }

  public getProfile(event: CurrentEventData<DailyChallengeSetBody, DailyChallengeSetMeta>, state: ComponentState): JSX.Element {
    
    const difficulty = (state.options as ChallengeOptions).difficulty;

    if (difficulty === "Advanced") {
      return ChallengeProfile({
        event: event.data.Advanced.challenge,
        metaData: event.metaData.Advanced 
      });
    } else {
      return ChallengeProfile({
        event: event.data.Standard.challenge,
        metaData: event.metaData.Standard 
      });
    }

  }

}