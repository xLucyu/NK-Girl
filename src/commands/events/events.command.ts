import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    ApplicationIntegrationType,
    InteractionContextType
} from "discord.js";
import { EventType } from "@utils";
import { eventChoices } from "./channel.command";
import { eventAnnouncer } from "@manager";

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
            .addChoices(...eventChoices)
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
            .addChoices(...eventChoices)
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

    if (!guildId) {
      await interaction.editReply("This command can only be used in a server.");
      return;
    }

    const eventType = interaction.options.getString("event_type",true) as EventType;

    if (subCommand === "send") {

      const message = await eventAnnouncer.send(eventType, guildId, true);

      if (!message) {
        await interaction.editReply(`Could not send **${eventType}**. Make sure an announcement channel is configured.`);
        return;
      }

      await interaction.editReply(`Successfully sent **${eventType}** in <#${message.channelId}>.`);
      return;
    }

    if (subCommand === "edit") {

      const messageId = interaction.options.getString("message_id", true);
      const message = await eventAnnouncer.edit(eventType, guildId, messageId);

      if (!message) {
        await interaction.editReply(`Could not edit the **${eventType}** announcement.`);
        return;
      }

      await interaction.editReply(`Successfully updated **${eventType}**.`);
      return;
    }
  }
}