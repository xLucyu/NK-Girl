import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    ApplicationIntegrationType,
    InteractionContextType
} from "discord.js";
import { EventType } from "@utils";

const eventTypeChoices = Object.values(EventType)
  .filter((value) => value !== EventType.CT)
  .map((value) => ({
    name: value,
    value,
  }));


export class EventCommand {
    
  public commandData = new SlashCommandBuilder()
    .setName("event")
    .setDescription("Manage event announcements")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription("Send an event manually")
        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription("Choose an event type.")
            .setRequired(true)
            .addChoices(...eventTypeChoices)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit an already sent event message")
        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription("Choose an event type.")
            .setRequired(true)
            .addChoices(...eventTypeChoices)
        )
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("Discord message id")
            .setRequired(true)
        )
    )
    .setIntegrationTypes(
        ApplicationIntegrationType.GuildInstall,
    )
    .setContexts(
          InteractionContextType.Guild,
    );


    public async execute(interaction: ChatInputCommandInteraction) {

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) throw new Error();

        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId;
        const eventType = interaction.options.getString("event_type", true) as EventType;

        if (subCommand === "send") {
            
        } else if (subCommand === "edit") {
            
        } else {
            return;
        }
    }
}