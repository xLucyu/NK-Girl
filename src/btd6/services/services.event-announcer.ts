import {
  AttachmentBuilder,
  ChannelType,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  Message,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { BaseBody, EventType } from "@btd6/types";
import { discordClient } from "@app";
import { registry } from "@discord";
import { imageBufferCache, render } from "@ui";
import { guildTable } from "@database";
import { EventCacheEntry } from "@btd6/cache";


type AnnounceableChannel = TextChannel | NewsChannel | ThreadChannel;

type AnnouncementMessage = {
  files: AttachmentBuilder[];
  components?: ContainerBuilder[];
  flags?: MessageFlags.IsComponentsV2;
};

export interface AnnouncementProfile {
  cacheKey: string;
  profile: JSX.Element;
}

export interface Announcement {
  eventBody: BaseBody;
  profiles: AnnouncementProfile[];
}

export class EventAnnouncer {

  private isSendableChannel(channel: unknown): channel is AnnounceableChannel {

    if (!channel || typeof channel !== "object") return false;

    return ("type" in channel && "send" in channel &&
      (
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement ||
        channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread
      )
    );
  }

  private async getChannel(guildId: string, eventType: EventType): Promise<AnnounceableChannel | undefined> {

    const channelId = await guildTable.fetchRegisteredChannel(
      eventType,
      guildId
    );
    if (!channelId) return;

    const channel = await discordClient.client.channels.fetch(channelId);
    if (!this.isSendableChannel(channel)) return;

    return channel;
  }

  private buildAnnouncement(event: EventCacheEntry<any, any>): Announcement | null {

    if (event.eventType === EventType.CT) return null;

    const commandName = event.eventType.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    const command = registry.get(commandName);

    return command.buildAnnouncement?.(event.currentEvent) ?? null;
  }

  private async renderProfiles(profiles: AnnouncementProfile[]): Promise<Buffer[]> {
    return Promise.all(
      profiles.map(({ cacheKey, profile }) => 
        imageBufferCache.getOrSet(
          cacheKey, () => render(profile)
        ))
    )
  }

  private buildMessage(buffers: Buffer[]): AnnouncementMessage {

    if (buffers.length === 0) throw new Error("Announcement contains no profiles.");

    const files = buffers.map((buffer, index) => {
      const name = `image-${index + 1}.png`;
      return new AttachmentBuilder(buffer, { name });
    });

    if (buffers.length === 1) return { files };

    const container = new ContainerBuilder();

    for (let index = 0; index < buffers.length; index++) {
      const name = `image-${index + 1}.png`;

      const gallery = new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL(`attachment://${name}`)
      );

      container.addMediaGalleryComponents(gallery);
    }

    return {
      files,
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    };
  }

  public async send(
    event: EventCacheEntry<any, any>,
    guildId: string,
    force = false
  ): Promise<Message | null> {

    if (event.eventType === EventType.CT) return null;

    const alreadyAnnounced = await guildTable.hasEvent(event.currentEvent.data.id, event.eventType, guildId);

    if (!force && alreadyAnnounced) return null;

    const channel = await this.getChannel(guildId, event.eventType);
    if (!channel) return null;

    const announcement = this.buildAnnouncement(event);
    if (!announcement) return null;

    const { eventBody, profiles } = announcement;

    const buffers = await this.renderProfiles(profiles);
    const message = await channel.send(this.buildMessage(buffers));

    if (channel.type === ChannelType.GuildAnnouncement) await message.crosspost();

    if (!alreadyAnnounced) {
      await guildTable.appendEvent(
        eventBody.id,
        event.eventType,
        guildId
      );
    }

    return message;
  }

  public async edit(
    event: EventCacheEntry<any, any>,
    guildId: string,
    messageId: string
  ): Promise<Message | null> {

    const announcement = this.buildAnnouncement(event);
    if (!announcement) return null;

    const channel = await this.getChannel(guildId, event.eventType);
    if (!channel) return null;

    const message = await channel.messages
      .fetch(messageId)
      .catch(() => null);

    if (!message) return null;

    const buffers = await this.renderProfiles(announcement.profiles);
    const messageData = this.buildMessage(buffers);

    return await message.edit({
      attachments: [],
      embeds: [],
      components: [],
      ...messageData,
    });
  }

  public async sendAll(event: EventCacheEntry<any, any>): Promise<void> {

    if (event.eventType === EventType.CT) return;

    const eventId = event.currentEvent.data.id;

    const channelIds = await guildTable.fetchAllRegisteredChannels(event.eventType);
    if (channelIds.length === 0) return;

    const targets = (await Promise.all(channelIds.map(async (channelId) => {

      const channel = await discordClient.client.channels
        .fetch(channelId)
        .catch(() => null);

      if (!this.isSendableChannel(channel)) return null;

      const alreadyAnnounced = await guildTable.hasEvent(
        eventId,
        event.eventType,
        channel.guildId
      );

      if (alreadyAnnounced) return null;

      return {
        channelId,
        channel,
      };
    }))).filter((target) => target !== null);

    if (targets.length === 0) return;

    const announcement = this.buildAnnouncement(event);
    if (!announcement) return;

    const { eventBody, profiles } = announcement;
    const buffers = await this.renderProfiles(profiles);

    const results = await Promise.allSettled(targets.map(async ({ channel }) => {

      const message = await channel.send(this.buildMessage(buffers));

      if (channel.type === ChannelType.GuildAnnouncement) await message.crosspost();

      await guildTable.appendEvent(
        eventBody.id,
        event.eventType,
        channel.guildId
      );
    }));

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status === "rejected") {
        console.error(
          `Failed to announce ${event.eventType} in channel ${targets[i].channelId}:`,
          result.reason
        );
      }
    }
  }
}

export const eventAnnouncer = new EventAnnouncer();