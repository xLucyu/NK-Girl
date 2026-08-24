import {
  ChannelType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

import { guildTable } from "@database";
import { EventType } from "@btd6";
import { Command } from "@discord";
import { MissingGuildID, MissingPermission } from "@lib";

export const eventChoices = Object.values(EventType)
  .filter((value) => value !== EventType.CT)
  .map((value) => ({
    name: value,
    value,
  }));

@Command({
  description: "Set or remove a channel for a specific event",
  autoComplete: false,
  userInstall: false
})
export class ChannelCommand {

  public commandData = new SlashCommandBuilder()
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Set a channel for event announcements")
        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription("Choose an event type")
            .setRequired(true)
            .addChoices(...eventChoices),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Choose an announcement channel")
            .setRequired(true)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove an event announcement channel")
        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription("Choose an event type")
            .setRequired(true)
            .addChoices(...eventChoices),
        ),
    )

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    await interaction.deferReply();

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) throw new MissingPermission();

    const guildId = interaction.guildId;
    if (!guildId) throw new MissingGuildID();

    const subCommand = interaction.options.getSubcommand();
    const eventType =interaction.options.getString("event_type", true) as EventType;

    if (subCommand === "add") {

      const channel =interaction.options.getChannel("channel", true);

      await guildTable.appendChannelPerGuild(
        guildId,
        channel.id,
        eventType,
      );

      await interaction.editReply({content: `Set **${eventType}** announcements to <#${channel.id}>.`});
      return;
    }

    const channelId = await guildTable.removeChannelFromGuild(guildId, eventType);

    if (!channelId) {
      await interaction.editReply({content: `There is no channel registered for **${eventType}**.`});
      return;
    }

    await interaction.reply({
      content: `Removed **${eventType}** announcements from <#${channelId}>.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
