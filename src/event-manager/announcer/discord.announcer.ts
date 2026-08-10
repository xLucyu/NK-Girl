import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  type Message,
  type NewsChannel,
  type TextChannel,
  type ThreadChannel,
} from "discord.js";
import {
  EventType,
  BossDifficulties,
  OdysseyDifficulties,
  type BaseBody,
} from "@utils";
import { guildTable } from "@database";
import { render } from "@components";
import { discordClient, registry } from "@client";
import { eventManager } from "@manager";
import {
  RaceProfile,
  BossRushProfile,
  OdysseyProfile,
  BossProfile,
  CollectionProfile
} from "@commands";

type AnnounceableChannel = TextChannel | NewsChannel | ThreadChannel;

interface Announcement {
  event: BaseBody;
  profiles: JSX.Element[];
}


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


  private async getChannel(
    guildId: string,
    eventType: EventType
  ): Promise<AnnounceableChannel | undefined> {

    const channelId =
      await guildTable.fetchRegisteredChannel(
        eventType,
        guildId
      );

    if (!channelId) return;

    const channel = await discordClient.client.channels.fetch(channelId);

    if (!this.isSendableChannel(channel)) return;

    return channel;
  }


  private buildAnnouncement(eventType: EventType): Announcement | null {

    const command = registry.get(eventType.toLowerCase()); // yes i need to implement this ;w;
    return command.buildAnnouncement?.();
  }


  private async buildAttachments(
    profiles: JSX.Element[]
  ): Promise<AttachmentBuilder[]> {

    const buffers =
      await Promise.all(
        profiles.map((profile) =>
          render(profile)
        )
      );

    return buffers.map(
      (buffer, index) =>
        new AttachmentBuilder(
          buffer,
          {
            name: `image-${index + 1}.png`,
          }
        )
    );
  }


public async send(
  eventType: EventType,
  guildId: string,
  force = false
): Promise<Message | null> {

  const announcement =
    this.buildAnnouncement(eventType);

  if (!announcement) return null;

  const {
    event,
    profiles
  } = announcement;

  const announced =
    await guildTable.fetchEventIds(
      eventType,
      guildId
    );

  if (
    !force &&
    announced.includes(event.id)
  ) {
    return null;
  }

  const channel =
    await this.getChannel(
      guildId,
      eventType
    );

  if (!channel) return null;

  const buffers = await Promise.all(
    profiles.map((profile) =>
      render(profile)
    )
  );

  const files = buffers.map((buffer, index) => {
    const name = `image-${index + 1}.png`;
      return new AttachmentBuilder(
        buffer,
        { name }
      );
    }
  );

  const embeds = buffers.map((_, index) => {
    const name = `image-${index + 1}.png`;

    return new EmbedBuilder()
      .setImage(
        `attachment://${name}`
      );
    }
  );

  const message = await channel.send({ files, embeds });

  await guildTable.appendEvent(
    event.id,
    eventType,
    guildId
  );

  return message;
}

  public async edit(
    eventType: EventType,
    guildId: string,
    messageId: string
  ): Promise<Message | null> {

    const announcement = this.buildAnnouncement(eventType);

    if (!announcement) return null;
    
    const channel =await this.getChannel(guildId, eventType);

    if (!channel) return null;

    const message = await channel.messages
      .fetch(messageId)
      .catch(() => null);

    if (!message) return null;

    const attachments = await this.buildAttachments(announcement.profiles);

    return await message.edit({
      attachments: [],
      files: attachments,
    });
  }

  public async sendAll(eventType: EventType): Promise<void> {

    const announcement = this.buildAnnouncement(eventType);
    if (!announcement) return;

    const { event, profiles } = announcement;

    const channelIds = await guildTable.fetchAllRegisteredChannels(eventType);

    if (channelIds.length === 0) return;

    const buffers = await Promise.all(profiles.map((profile) => render(profile)));

    const results = await Promise.allSettled(channelIds.map(async (channelId) => {

      const channel = await discordClient.client.channels
        .fetch(channelId)
        .catch(() => null);

      if (!this.isSendableChannel(channel)) return;

      const guildId = channel.guildId;

      const announced = await guildTable.fetchEventIds(eventType, guildId);

      if (announced.includes(event.id)) return;

      const attachments = buffers.map(
        (buffer, index) =>
          new AttachmentBuilder(buffer, {
            name: `image-${index + 1}.png`,
        })
      );

      await channel.send({files: attachments });

      await guildTable.appendEvent(
        event.id,
        eventType,
        guildId
      );
    })
  );

    for (let i = 0; i < results.length; i++) {

      const result = results[i];

      if (result.status === "rejected") {
        console.error(
          `Failed to announce ${eventType} in channel ${channelIds[i]}:`,
          result.reason
        );
      }
    }
  }
}

export const eventAnnouncer = new EventAnnouncer();
