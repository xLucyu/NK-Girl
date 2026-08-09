import {
  ApplicationIntegrationType,
  ChannelType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

import { guildTable } from "@database";
import { EventType } from "@utils";

export const eventChoices = Object.values(EventType)
  .filter((value) => value !== EventType.CT)
  .map((value) => ({
    name: value,
    value,
  }));


export class ChannelCommand {

  public commandData = new SlashCommandBuilder()
    .setName("channel")
    .setDescription(
      "Manage event announcement channels",
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageGuild,
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(
          "Set a channel for event announcements",
        )

        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription(
              "Choose an event type",
            )
            .setRequired(true)
            .addChoices(...eventChoices),
        )

        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Choose an announcement channel",
            )
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
        .setDescription(
          "Remove an event announcement channel",
        )

        .addStringOption((option) =>
          option
            .setName("event_type")
            .setDescription(
              "Choose an event type",
            )
            .setRequired(true)
            .addChoices(...eventChoices),
        ),
    )

    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
    )
    .setContexts(
      InteractionContextType.Guild,
    );

  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {

    const guildId = interaction.guildId;

    if (!guildId)
      throw new Error();

    const subCommand =
      interaction.options.getSubcommand();

    const eventType =
      interaction.options.getString(
        "event_type",
        true,
      ) as EventType;

    if (subCommand === "add") {

      const channel =
        interaction.options.getChannel(
          "channel",
          true,
        );

      await guildTable.appendChannelPerGuild(
        guildId,
        channel.id,
        eventType,
      );

      await interaction.reply({
        content:
          `Set **${eventType}** announcements to <#${channel.id}>.`,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const channelId =
      await guildTable.removeChannelFromGuild(
        guildId,
        eventType,
      );

    if (!channelId) {
      await interaction.reply({
        content:
          `There is no channel registered for **${eventType}**.`,
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    await interaction.reply({
      content:
        `Removed **${eventType}** announcements from <#${channelId}>.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}