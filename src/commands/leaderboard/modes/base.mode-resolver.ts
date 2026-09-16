import type { ChatInputCommandInteraction } from "discord.js";
import type { LeaderboardData, LeaderboardType } from "../base.leaderboard";
import { eventScheduler, EventType, type LeaderboardPayload } from "@btd6";
import { gsc } from "@btd6/storage";

export abstract class LeaderboardModeResolver {

  public abstract readonly eventType: LeaderboardType;

  public abstract resolve(interaction: ChatInputCommandInteraction,): Promise<LeaderboardData | null>;

  protected async resolveLeaderboard(
    interaction: ChatInputCommandInteraction,
    pathForEvent: (event: string) => string,
  ): Promise<LeaderboardPayload | null> {

    const selected = interaction.options.getString("event");

    if (selected) return gsc.read<LeaderboardPayload>(pathForEvent(selected));

    const now = Date.now();
    const events = eventScheduler
      .getEventCache(this.eventType)
      .getLeaderboardEvents(now);

    for (const event of events) {
      const name = this.eventType === EventType.CT ? event.id : event.name;
      const data = await gsc.read<LeaderboardPayload>(pathForEvent(name));
      if (data && data.start <= now && data.teams.length > 0) return data;
    }

    return null;
  }
}
