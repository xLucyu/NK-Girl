import { withDb } from "../pool";
import { EventType } from "@utils";


export class GuildTable {

  public async appendChannelPerGuild(
    guildId: string,
    channelId: string,
    event: EventType
  ): Promise<void> {

    await withDb(async (client) => {

      await client.query(
        `
        INSERT INTO event_announcements (
          guild_id,
          event_type,
          channel_id
        )
        VALUES ($1, $2, $3)

        ON CONFLICT (guild_id, event_type)
        DO UPDATE SET
          channel_id = EXCLUDED.channel_id
        `,
        [guildId, event, channelId]
      );
    });
  }

  public async removeChannelFromGuild(
    guildId: string,
    event: EventType
  ): Promise<string | null> {

    return await withDb(async (client) => {

      const result = await client.query<{channel_id: string | null}>(
        `
        SELECT channel_id
        FROM event_announcements
        WHERE guild_id = $1
          AND event_type = $2
        `,[guildId, event]
      );

      const channelId = result.rows[0]?.channel_id ?? null;
      if (!channelId) return null;

      await client.query(
        `
        UPDATE event_announcements
        SET channel_id = NULL
        WHERE guild_id = $1
        AND event_type = $2
        `,
        [guildId, event]
      );

      return channelId;
    });
  }

  public async fetchAllRegisteredChannels(
    event: EventType
  ): Promise<string[]> {

    return await withDb(async (client) => {

      const result = await client.query<{channel_id: string}>(
        `
        SELECT channel_id
        FROM event_announcements
        WHERE event_type = $1
          AND channel_id IS NOT NULL
        `,
        [event]
      );

      return result.rows.map(
        (row) => row.channel_id
      );
    });
  }

  public async fetchRegisteredChannel(
    event: EventType,
    guildId: string
  ): Promise<string | null> {

    return await withDb(async (client) => {

      const result = await client.query<{channel_id: string | null}>(
        `
        SELECT channel_id
        FROM event_announcements
        WHERE guild_id = $1
          AND event_type = $2
        `,
        [guildId, event]
      );

      return result.rows[0]?.channel_id ?? null;
    });
  }

  public async appendEvent(
    eventId: string,
    event: EventType,
    guildId: string
  ): Promise<void> {

    await withDb(async (client) => {

      await client.query(
        `
        INSERT INTO event_announcements (
          guild_id,
          event_type,
          announced_event_ids
        )
        VALUES (
          $1,
          $2,
          ARRAY[$3::TEXT]
        )

        ON CONFLICT (guild_id, event_type)
        DO UPDATE SET
          announced_event_ids =
            CASE
              WHEN $3::TEXT = ANY(
                event_announcements.announced_event_ids
              )
              THEN event_announcements.announced_event_ids

              ELSE array_append(
                event_announcements.announced_event_ids,
                $3::TEXT
              )
            END
        `,
        [guildId, event, eventId]
      );

    });
  }

  public async fetchEventIds(
    event: EventType,
    guildId: string
  ): Promise<string[]> {

    return await withDb(async (client) => {

      const result = await client.query<{announced_event_ids: string[];}>(
        `
        SELECT announced_event_ids
        FROM event_announcements
        WHERE guild_id = $1
        AND event_type = $2
        `,
        [guildId, event]
      );

      return (
        result.rows[0]?.announced_event_ids ??
        []
      );
    });
  }

  public async hasEvent(
    eventId: string,
    event: EventType,
    guildId: string
  ): Promise<boolean> {

    const ids = await this.fetchEventIds(event, guildId);

    return ids.includes(eventId);
  }
}

export const guildTable = new GuildTable();