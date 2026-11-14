import { createHash } from "node:crypto";
import {
  AttachmentBuilder,
  ChannelType,
  DiscordAPIError,
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

  private async sendToChannel(
    channel: AnnounceableChannel,
    eventType: EventType,
    eventId: string,
    buffers: Buffer[]
  ): Promise<Message | "skipped"> {
    const payload = this.buildMessage(buffers);
    const guildId = channel.guildId;
    const claimedId = await guildTable.claimEvent(eventType, eventId, guildId, channel.id);
    if (claimedId === null) return "skipped";

    // Discord deduplicates recent requests with the same nonce, including HTTP retries.
    const nonce = createHash("sha256")
      .update(JSON.stringify([channel.id, eventType, claimedId]))
      .digest("hex")
      .slice(0, 25);
    const context = `${eventType} ${claimedId} in guild ${guildId}, channel ${channel.id}`;

    let message: Message;
    try {
      message = await channel.send({ ...payload, nonce, enforceNonce: true });
    } catch (error) {
      if (error instanceof DiscordAPIError && [400, 401, 403, 404].includes(error.status)) {
        await guildTable.finishEvent(eventType, claimedId, guildId, false).catch((releaseError) => {
          console.error(`Failed to release announcement claim for ${context}:`, releaseError);
        });
      } else {
        // A transport or server error can arrive after Discord created the message.
        console.error(`Keeping announcement claim after uncertain delivery of ${context}:`, error);
      }
      throw error;
    }

    await guildTable.finishEvent(eventType, claimedId, guildId, true).catch((error) => {
      console.error(`Failed to record announcement message ${message.id} for ${context}:`, error);
    });

    if (channel.type === ChannelType.GuildAnnouncement) {
      await message.crosspost().catch((error) => {
        console.error(`Failed to crosspost announcement message ${message.id} for ${context}:`, error);
      });
    }

    return message;
  }

  public async send(
    event: EventCacheEntry<any, any>,
    guildId: string
  ): Promise<Message | "skipped" | null> {
    const channel = await this.getChannel(guildId, event.eventType);
    if (!channel) return null;

    const announcement = this.buildAnnouncement(event);
    if (!announcement) return null;

    const buffers = await this.renderProfiles(announcement.profiles);
    return this.sendToChannel(channel, event.eventType, event.currentEvent.data.id, buffers);
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

    const channelIds = await guildTable.fetchUnannouncedChannels(event.eventType, eventId);
    if (channelIds.length === 0) return;

    const announcement = this.buildAnnouncement(event);
    if (!announcement) return;

    const buffers = await this.renderProfiles(announcement.profiles);

    const results = await Promise.allSettled(channelIds.map(async (channelId) => {
      const channel = await discordClient.client.channels.fetch(channelId);
      if (!this.isSendableChannel(channel)) return;
      await this.sendToChannel(channel, event.eventType, eventId, buffers);
    }));

    for (const [index, result] of results.entries()) {
      if (result.status === "rejected") {
        console.error(
          `Failed to announce ${event.eventType} in channel ${channelIds[index]}:`,
          result.reason
        );
      }
    }
  }
}

export const eventAnnouncer = new EventAnnouncer();