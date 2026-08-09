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

  public async fetchAllRegisteredChannels(
    event: EventType
  ): Promise<string[]> {

    return await withDb(async (client) => {

      const result = await client.query<{channel_id: string}>(
        `
        select channel_id
        from event_announcements
        where event_type = $1
        and channel_id IS NOT NULL
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

  public async appendEvent(
    eventId: string,
    event: EventType,
    guildId: string
  ): Promise<void> {

    await withDb(async (client) => {

      await client.query(
        `
        insert into event_announcements (
          guild_id,
          event_type,
          announced_event_ids
        )
        values (
          $1,
          $2,
          array[$3::text]
        )

        on conflict (guild_id, event_type)
        do update set
          announced_event_ids =
            case
              when $3::text = any(
                event_announcements.announced_event_ids
              )
              then event_announcements.announced_event_ids

              else array_append(
                event_announcements.announced_event_ids,
                $3::text
              )
            end
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
        select announced_event_ids
        from event_announcements
        where guild_id = $1
        and event_type = $2
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