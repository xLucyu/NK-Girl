import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  SlashCommandBuilder,
} from "discord.js";
import { ChallengeProfile } from "./daily.profile";
import { BaseCommand } from "@commands/base.btd6-command";
import {
  Announcement,
  API_URLS,
  CurrentEventData,
  DailyChallengeSetBody,
  DailyChallengeSetMeta,
  DailyChallengeDifficulty,
  EventType,
  MetaData,
  DailyChallengeDifficulties,
} from "@btd6";
import {
  BaseOptions,
  BuildButtonMenu,
  Command,
  ComponentState,
} from "@discord";
import { CodeNotFound, getData } from "@lib";
import {
  createImageCacheKey,
  imageBufferCache,
  render,
} from "@ui";


export interface ChallengeOptions extends BaseOptions {
  difficulty: DailyChallengeDifficulty;
}

type ChallengeMeta = CurrentEventData<DailyChallengeSetBody, DailyChallengeSetMeta>;


@Command({
  description: "Get the daily challenge or look one up using a code",
  autoComplete: false,
})
export class ChallengeCommand extends BaseCommand<DailyChallengeSetBody, DailyChallengeSetMeta> {

  protected readonly eventType = EventType.Challenge;
  protected readonly urlKey = EventType.Collection;

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
              ...DailyChallengeDifficulties.map((difficulty) => ({
                name: difficulty,
                value: difficulty
              }))
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

      case "daily": return super.execute(interaction);
      case "lookup": return this.executeLookup(interaction);
    }
  }

  public getProfile(event: ChallengeMeta, state: ComponentState): JSX.Element {

    const difficulty = (state.options as ChallengeOptions).difficulty;

    return ChallengeProfile({
      event: event.data[difficulty],
      metaData: event.metaData[difficulty],
      difficulty: difficulty
    });
  }

  public buildAnnouncement(event: ChallengeMeta): Announcement {

    return {
      eventBody: event.data,
      profiles: (["Advanced"] as const).map(difficulty => ({
        cacheKey: this.createProfileCacheKey(event.data, { difficulty }),
        profile:ChallengeProfile({
            event: event.data[difficulty],
            metaData: event.metaData[difficulty],
	    difficulty
          }),
      })),
    };
  }

  protected getComponents(): InteractionReplyOptions["components"] {

    return [
      BuildButtonMenu({
        buttons: DailyChallengeDifficulties.map((difficulty) => ({
          label: difficulty,
          customId: `challenge:difficulty:${difficulty}`,
          style: difficulty === "Advanced" ? ButtonStyle.Danger : ButtonStyle.Success
        })),
      }),
    ]
  }

  private async executeLookup(interaction: ChatInputCommandInteraction): Promise<void> {

    await interaction.deferReply();

    const code = interaction.options.getString("code", true).trim().toUpperCase();
    const cacheKey = createImageCacheKey("ChallengeLookup", code);

    const buffer = await imageBufferCache.getOrSet(
      cacheKey,
      async () => {

        const response = await getData<MetaData>(`${API_URLS.Challenge}/${code}`);
        if (!response.success) throw new CodeNotFound();

        return render(ChallengeProfile({ metaData: response.body, code: code }));
      }
    );

    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    await interaction.editReply({ files: [attachment] });
  }


  protected getIdentity(data: DailyChallengeSetBody): string {
    return data.name;
  }

  protected getOptions(interaction: ChatInputCommandInteraction): ChallengeOptions {
    return {
      difficulty: interaction.options.getString("difficulty") as DailyChallengeDifficulty ?? "Advanced",
    };
  }
}
