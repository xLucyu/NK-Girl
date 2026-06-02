import {
  AttachmentBuilder,
  ChannelType,
  Client,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { JSX } from "react";
import { BaseBody, EventType } from "@utils/types";
import { GuildTable } from "@database/tables/guild.table";
import { render } from "@components/react/render";

type AnnounceableChannel = TextChannel | NewsChannel | ThreadChannel;

export class EventAnnouncer {

    private client: Client;
    private guildTable: GuildTable;

    constructor(client: Client, guildTable: GuildTable) {
        this.client = client;
        this.guildTable = guildTable;
    }

    private isSendableChannel(channel: unknown): channel is AnnounceableChannel {

        if (!channel || typeof channel !== "object") return false;

        return (
        "type" in channel &&
        (channel.type === ChannelType.GuildText ||
            channel.type === ChannelType.GuildAnnouncement ||
            channel.type === ChannelType.PublicThread ||
            channel.type === ChannelType.PrivateThread) &&
        "send" in channel
        );
  }

    public async announceNewEvent(eventType: EventType, event: BaseBody, profiles: JSX.Element[]): Promise<void> {

        const channelIds = await this.guildTable.fetchAllRegisteredChannels(eventType);
        const buffers = await Promise.all(profiles.map((profile) => render(profile)));

        for (const channelId of channelIds) {
            try {
                const channel = await this.client.channels.fetch(channelId);

                if (!this.isSendableChannel(channel)) continue;

                const guildId = channel.guild.id;

                const announcedIds = await this.guildTable.fetchEventIds(eventType, guildId);
                if (announcedIds.includes(event.id)) continue;

                const attachments = buffers.map((buffer, i) =>
                new AttachmentBuilder(buffer, { name: `image_${i + 1}.png` })
                );

                await channel.send({
                files: attachments,
                });

                await this.guildTable.appendEvent(event.id, eventType, guildId);
            } catch (error) {
                console.error(
                `Failed to announce ${eventType} in channel ${channelId}`,
                error
                );
            }
        }
    }
}