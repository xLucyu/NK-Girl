import {
  AttachmentBuilder,
  ChannelType,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  type Message,
  type NewsChannel,
  type TextChannel,
  type ThreadChannel,
} from "discord.js";
import {
  EventType,
  type BaseBody,
} from "@utils";
import { guildTable } from "@database";
import { render } from "@components";
import { discordClient, registry } from "@client";
import { eventManager } from "../manager";

type AnnounceableChannel = TextChannel | NewsChannel | ThreadChannel;

type AnnouncementMessage = {
  files: AttachmentBuilder[];
  components?: ContainerBuilder[];
  flags?: MessageFlags.IsComponentsV2;
};

export interface Announcement {
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

    const channelId = await guildTable.fetchRegisteredChannel(
      eventType,
      guildId
    );

    if (!channelId) return;

    const channel = await discordClient.client.channels.fetch(channelId);

    if (!this.isSendableChannel(channel)) return;

    return channel;
  }

  private buildAnnouncement(eventType: EventType): Announcement | null {

    if (eventType === EventType.CT) return null;

    const cache = eventManager.getEventCache(eventType).getCache();
    if (!cache) return null;

    const commandName = eventType.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    const command = registry.get(commandName);

    return command.buildAnnouncement?.(cache.currentEvent) ?? null;
  }

  private async renderProfiles(profiles: JSX.Element[]) {
    return await Promise.all(profiles.map((profile) => render(profile)));
  }

  private buildMessage(buffers: Awaited<ReturnType<typeof render>>[]): AnnouncementMessage {

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
    eventType: EventType,
    guildId: string,
    force = false
  ): Promise<Message | null> {

    if (eventType === EventType.CT) return null;

    const cache = eventManager.getEventCache(eventType).getCache();
    if (!cache) return null;

    const eventId = cache.currentEvent.data.id;
    const alreadyAnnounced = await guildTable.hasEvent(eventId, eventType, guildId);

    if (!force && alreadyAnnounced) return null;

    const channel = await this.getChannel(guildId, eventType);
    if (!channel) return null;

    const announcement = this.buildAnnouncement(eventType);
    if (!announcement) return null;

    const { event, profiles } = announcement;

    const buffers = await this.renderProfiles(profiles);
    const message = await channel.send(this.buildMessage(buffers));

    if (!alreadyAnnounced) {
      await guildTable.appendEvent(
        event.id,
        eventType,
        guildId
      );
    }

    return message;
  }

  public async edit(
    eventType: EventType,
    guildId: string,
    messageId: string
  ): Promise<Message | null> {

    const announcement = this.buildAnnouncement(eventType);
    if (!announcement) return null;

    const channel = await this.getChannel(guildId, eventType);
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

  public async sendAll(eventType: EventType): Promise<void> {

    if (eventType === EventType.CT) return;

    const cache = eventManager.getEventCache(eventType).getCache();
    if (!cache) return;

    const eventId = cache.currentEvent.data.id;

    const channelIds = await guildTable.fetchAllRegisteredChannels(eventType);
    if (channelIds.length === 0) return;

    const targets = (await Promise.all(channelIds.map(async (channelId) => {

      const channel = await discordClient.client.channels
        .fetch(channelId)
        .catch(() => null);

      if (!this.isSendableChannel(channel)) return null;

      const alreadyAnnounced = await guildTable.hasEvent(
        eventId,
        eventType,
        channel.guildId
      );

      if (alreadyAnnounced) return null;

      return {
        channelId,
        channel,
      };
    }))).filter((target) => target !== null);

    if (targets.length === 0) return;

    const announcement = this.buildAnnouncement(eventType);
    if (!announcement) return;

    const { event, profiles } = announcement;
    const buffers = await this.renderProfiles(profiles);

    const results = await Promise.allSettled(targets.map(async ({ channel }) => {

      await channel.send(this.buildMessage(buffers));

      await guildTable.appendEvent(
        event.id,
        eventType,
        channel.guildId
      );
    }));

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status === "rejected") {
        console.error(
          `Failed to announce ${eventType} in channel ${targets[i].channelId}:`,
          result.reason
        );
      }
    }
  }
}

export const eventAnnouncer = new EventAnnouncer();
