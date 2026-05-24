// src/database/tables/guild.table.ts
import { withDb } from "../pool";
import { EventType } from "@utils/types";

function channelColumn(event: EventType) {
  return `${event.toLowerCase()}channelid`;
}

function idsColumn(event: EventType) {
  return `${event.toLowerCase()}ids`;
}

function parseIds(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
}


export class GuildTable {


  public async appendChannelPerGuild(guildId: string, channelId: string, event: EventType): Promise<void> {

    await withDb(async (client) => {
      const column = channelColumn(event);

      await client.query(
        `
        INSERT INTO guilds (guildid)
        VALUES ($1)
        ON CONFLICT (guildid) DO NOTHING
        `,
        [guildId]
      );

      await client.query(
        `
        UPDATE guilds
        SET ${column} = $1
        WHERE guildid = $2
        `,
        [channelId, guildId]
      );
    });
  }

  public async removeChannelFromGuild(guildId: string, event: EventType): Promise<string | null> {

    return await withDb(async (client) => {
      const column = channelColumn(event);

      const result = await client.query<{ channelid: string | null }>(
        `
        SELECT ${column} AS channelid
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );

      const oldChannelId = result.rows[0]?.channelid ?? null;

      if (!oldChannelId) {
        return null;
      }

      await client.query(
        `
        UPDATE guilds
        SET ${column} = NULL
        WHERE guildid = $1
        `,
        [guildId]
      );

      return oldChannelId;
    });
  }

  public async fetchAllRegisteredChannels(event: EventType): Promise<string[]> {

    return await withDb(async (client) => {
      const column = channelColumn(event);

      const result = await client.query<{ channelid: string }>(
        `
        SELECT ${column} AS channelid
        FROM guilds
        WHERE ${column} IS NOT NULL
        `
      );

      return result.rows.map((row) => row.channelid);
    });
  }

  public async appendEvent(eventId: string, event: EventType, guildId: string): Promise<void> {

    await withDb(async (client) => {
      const column = idsColumn(event);

      await client.query(
        `
        INSERT INTO guilds (guildid)
        VALUES ($1)
        ON CONFLICT (guildid) DO NOTHING
        `,
        [guildId]
      );

      const result = await client.query<{ ids: unknown }>(
        `
        SELECT ${column} AS ids
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );

      const eventIds = parseIds(result.rows[0]?.ids);

      if (eventIds.includes(eventId)) {
        return;
      }

      eventIds.push(eventId);

      await client.query(
        `
        UPDATE guilds
        SET ${column} = $1
        WHERE guildid = $2
        `,
        [JSON.stringify(eventIds), guildId]
      );
    });
  }

  public async fetchEventIds(event: EventType, guildId: string): Promise<string[]> {

    return await withDb(async (client) => {
      const column = idsColumn(event);

      const result = await client.query<{ ids: unknown }>(
        `
        SELECT ${column} AS ids
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );

      return parseIds(result.rows[0]?.ids);
    });
  }
}