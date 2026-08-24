import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits
} from "discord.js";
import { eventChoices } from "./channel.command";
import { Command } from "@discord";
import { ChannelNotFound, EventNotFound, MissingGuildID, MissingPermission } from "@lib";
import { eventAnnouncer, EventType, eventScheduler } from "@btd6";

@Command({
  description: "Send or edit an Event in coordinates to the discord channel",
  userInstall: false
})
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


  public async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();
    
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) throw new MissingPermission();

    const subCommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) throw new MissingGuildID();

    const eventType = interaction.options.getString("event_type",true) as EventType;
    const cache = eventScheduler.getEventCache(eventType).getCache();

    if (!cache) throw new EventNotFound();

    if (subCommand === "send") {

      const message = await eventAnnouncer.send(cache, guildId, true);

      if (!message) throw new ChannelNotFound();

      await interaction.editReply(`Successfully sent **${eventType}** in <#${message.channelId}>.`);
      return;
    }

    if (subCommand === "edit") {

      const messageId = interaction.options.getString("message_id", true);
      const message = await eventAnnouncer.edit(cache, guildId, messageId);

      if (!message) throw new ChannelNotFound();

      await interaction.editReply(`Successfully updated **${eventType}**.`);
      return;
    }
  }
}
