import { withDb } from "@database/pool";
import { EventType } from "@btd6/types";

// Boss, Race, and Odyssey IDs have been stored both raw and prefixed with the event name.
function announcementKey(eventType: EventType, eventId: string): [EventType, string, string | null] {
  if (eventType === EventType.Boss || eventType === EventType.Race || eventType === EventType.Odyssey) {
    const shortId = eventId.match(/^(?:.+_)?([a-z0-9]{8})$/)?.[1];
    if (shortId) return [eventType, shortId, `_${shortId}`];
  }

  return [eventType, eventId, null];
}

const unclaimedEvent = `
  NOT ($2::text = ANY(pending_event_ids))
  AND NOT EXISTS (
    SELECT 1
    FROM unnest(announced_event_ids) AS stored(id)
    WHERE stored.id = $2::text OR right(stored.id, length($3::text)) = $3::text
  )
`;

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
        select channel_id
        from event_announcements
        where guild_id = $1
        and event_type = $2
        `,[guildId, event]
      );

      const channelId = result.rows[0]?.channel_id ?? null;
      if (!channelId) return null;

      await client.query(
        `
        update event_announcements
        set channel_id = NULL
        where guild_id = $1
        and event_type = $2
        `,
        [guildId, event]
      );

      return channelId;
    });
  }

  public async fetchUnannouncedChannels(
    eventType: EventType,
    eventId: string
  ): Promise<string[]> {
    return await withDb(async (client) => {
      const result = await client.query<{ channel_id: string }>(
        `
        SELECT channel_id
        FROM event_announcements
        WHERE event_type = $1 AND channel_id IS NOT NULL AND ${unclaimedEvent}
        `,
        announcementKey(eventType, eventId)
      );

      return result.rows.map((row) => row.channel_id);
    });
  }

  public async fetchRegisteredChannel(
    event: EventType,
    guildId: string
  ): Promise<string | null> {

    return await withDb(async (client) => {

      const result = await client.query<{channel_id: string | null}>(
        `
        select channel_id
        from event_announcements
        where guild_id = $1
        and event_type = $2
        `,
        [guildId, event]
      );

      return result.rows[0]?.channel_id ?? null;
    });
  }

  public async claimEvent(
    eventType: EventType,
    eventId: string,
    guildId: string,
    channelId: string
  ): Promise<string | null> {
    const key = announcementKey(eventType, eventId);

    return await withDb(async (client) => {
      // PostgreSQL rechecks the predicate after a concurrent update to this guild's row.
      const result = await client.query(
        `
        UPDATE event_announcements
        SET pending_event_ids = array_append(pending_event_ids, $2::text)
        WHERE event_type = $1 AND guild_id = $4 AND channel_id = $5 AND ${unclaimedEvent}
        RETURNING guild_id
        `,
        [...key, guildId, channelId]
      );

      return result.rowCount === 1 ? key[1] : null;
    });
  }

  public async finishEvent(
    eventType: EventType,
    eventId: string,
    guildId: string,
    sent: boolean
  ): Promise<void> {
    const [, id] = announcementKey(eventType, eventId);

    await withDb(async (client) => {
      await client.query(
        `
        UPDATE event_announcements
        SET pending_event_ids = array_remove(pending_event_ids, $2::text),
            announced_event_ids = CASE
              WHEN $4::boolean THEN array_append(announced_event_ids, $2::text)
              ELSE announced_event_ids
            END
        WHERE event_type = $1 AND guild_id = $3 AND $2::text = ANY(pending_event_ids)
        `,
        [eventType, id, guildId, sent]
      );
    });
  }
}

export const guildTable = new GuildTable();