import {
  AttachmentBuilder,
  ChannelType,
  Message,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { JSX } from "react";
import { BaseBody, EventType } from "@utils";
import { guildTable } from "@database";
import { render } from "@components";
import { discordClient } from "@client";

type AnnounceableChannel = TextChannel | NewsChannel | ThreadChannel;


export class EventAnnouncer {


  private isSendableChannel(channel: unknown): channel is AnnounceableChannel {

    if (!channel || typeof channel !== "object") return false;

    return (
      "type" in channel &&
      "send" in channel &&
      (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement ||
        channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread
      )
    );
  }


  private async getChannel(guildId: string, eventType: EventType): Promise<AnnounceableChannel | undefined> {

    const channelId = await guildTable.fetchRegisteredChannel(eventType, guildId);
    if (!channelId) return;

    const channel = await discordClient.client.channels.fetch(channelId);
    if (!this.isSendableChannel(channel)) return;

    return channel
  }


  private async buildAttachments(profiles: JSX.Element[]): Promise<AttachmentBuilder[]> {

    const buffers = await Promise.all(profiles.map((profile) => render(profile)));
    return buffers.map(
      (buffer) =>
        new AttachmentBuilder(buffer, { name: "image.png" })
    );
  }

  
  public async edit(eventType: EventType, profiles: JSX.Element[], guildId: string, messageId: string): Promise<Message | null> {

    const channel = await this.getChannel(guildId, eventType);
    if (!channel) return null;
    const message = await channel.messages.fetch(messageId).catch(() => null);
    if (!message) return null;
    const attachments = await this.buildAttachments(profiles);
    return await message.edit({
      files: attachments,
    });
  }


  public async send(eventType: EventType, event: BaseBody, profiles: JSX.Element[], guildId: string): Promise<Message | null> {

    const announced = await guildTable.fetchEventIds(eventType, guildId);
    if (announced.includes(event.id)) return null;

    const channel = await this.getChannel(guildId, eventType);
    if (!channel) return null;

    const attachments = await this.buildAttachments(profiles);
    const message = await channel.send({ files: attachments });
    await guildTable.appendEvent(event.id, eventType, guildId);
    return message;
  }
}