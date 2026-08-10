import {
  AttachmentBuilder,
  ChannelType,
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
import { discordClient } from "@client";
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

    switch (eventType) {

      case EventType.Race: {

        const cache = eventManager.getEventCache(EventType.Race).getCache();

        if (!cache) return null;

        const {
          data: event,
          metaData,
        } = cache.currentEvent;

        return {
          event,
          profiles: [
            RaceProfile({
              event,
              metaData,
            }),
          ],
        };
      }


      case EventType.Boss: {

        const cache = eventManager
          .getEventCache(EventType.Boss)
          .getCache();

        if (!cache) return null;

        const {
          data: event,
          metaData,
        } = cache.currentEvent;

        return {
          event,

          profiles: BossDifficulties.map(
            (difficulty) =>
              BossProfile({
                event,
                metaData: metaData[difficulty],
                difficulty,
              })
          ),
        };
      }


      case EventType.Odyssey: {

        const cache = eventManager
          .getEventCache(EventType.Odyssey)
          .getCache();

        if (!cache) return null;

        const {
          data: event,
          metaData,
        } = cache.currentEvent;

        return {
          event,

          profiles: OdysseyDifficulties.map(
            (difficulty) =>
              OdysseyProfile({
                event,
                metaData: metaData[difficulty],
                difficulty,
              })
          ),
        };
      }

      case EventType.BossRush: {

        const cache = eventManager
          .getEventCache(EventType.BossRush)
          .getCache();

        if (!cache) return null;

        const {
          data: event,
          metaData
        } = cache.currentEvent;

        return {

          event,
          profiles: [
            BossRushProfile({
              event,
              metaData,
            }),
          ],
        };
      }


      case EventType.Collection: {

        const cache = eventManager
          .getEventCache(EventType.Collection)
          .getCache();

        if (!cache) return null;

        const {
          data: event,
          metaData,
        } = cache.currentEvent;

        return {
          event,

          profiles: [
            CollectionProfile({
              event,
              metaData,
              offset: 0,
            }),
          ],
        };
      }


      default:
        return null;
    }
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

    const announcement = this.buildAnnouncement(eventType);

    if (!announcement) return null;
    const { event, profiles } = announcement;

    const announced = await guildTable.fetchEventIds(eventType, guildId);
    if (!force && announced.includes(event.id)) return null;

    const channel =await this.getChannel(guildId, eventType);
    if (!channel) return null;

    const attachments =await this.buildAttachments(profiles);
    const message = await channel.send({ files: attachments });
    await guildTable.appendEvent(event.id, eventType, guildId);

    return message;
  }

  public async edit(
    eventType: EventType,
    guildId: string,
    messageId: string
  ): Promise<Message | null> {

    const announcement = this.buildAnnouncement(eventType);

    if (!announcement) return null;
    
    const channel =
      await this.getChannel(
        guildId,
        eventType
      );

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
}

export const eventAnnouncer = new EventAnnouncer();
