import { withDb } from "../pool";
import { EventType } from "@utils";

export class GuildTable {

  public async appendChannelPerGuild(guildId: string, channelId: string, event: EventType): Promise<void> {

    await withDb(async (client) => {
      const column = `${event.toLowerCase()}channelid`;

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
      
      const column = `${event.toLowerCase()}channelid`;

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
      
      const column = `${event.toLowerCase()}channelid`;

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

  public async fetchRegisteredChannel(event: EventType, guildId: string): Promise<string | null> {
    
    return await withDb(async (client) => {
      
      const column = `${event.toLowerCase()}channelid`;
      const result = await client.query<{ channelid: string | null }>(
        `
        SELECT ${column} AS channelid
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );
      return result.rows[0]?.channelid ?? null;
    });
  }

  public async appendEvent(eventId: string, event: EventType, guildId: string): Promise<void> {

    await withDb(async (client) => {
      const column = `${event.toLowerCase()}ids`;

      await client.query(
        `
        INSERT INTO guilds (guildid)
        VALUES ($1)
        ON CONFLICT (guildid) DO NOTHING
        `,
        [guildId]
      );

      const result = await client.query<{ ids: string[] | null }>(
        `
        SELECT ${column} AS ids
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );

      const eventIds = result.rows[0]?.ids ?? [];

      if (eventIds.includes(eventId)) {
        return;
      }

      await client.query(
        `
        UPDATE guilds
        SET ${column} = $1
        WHERE guildid = $2
        `,
        [[...eventIds, eventId], guildId]
      );
    });
  }

  public async fetchEventIds(event: EventType, guildId: string): Promise<string[]> {

    return await withDb(async (client) => {
      const column = `${event.toLowerCase()}ids`;

      const result = await client.query<{ ids: string[] | null }>(
        `
        SELECT ${column} AS ids
        FROM guilds
        WHERE guildid = $1
        `,
        [guildId]
      );

      return result.rows[0]?.ids ?? [];
    });
  }
}