import type { ChatInputCommandInteraction } from "discord.js";
import type { LeaderboardData, LeaderboardType } from "../base.leaderboard";
import { eventManager } from "@manager";
import { EventType } from "@utils";

export abstract class LeaderboardModeResolver {

  public abstract readonly eventType: LeaderboardType;

  public abstract resolve(
    interaction: ChatInputCommandInteraction,
  ): Promise<LeaderboardData | null>;

  protected resolveEventName(interaction: ChatInputCommandInteraction): string {

    const selected = interaction.options.getString("event");
    if (selected) return selected;

    const currentEvent = eventManager
      .getEventCache(this.eventType)
      .getCache()
      ?.currentEvent.data;

    if (!currentEvent) {
      throw new Error(`No current ${this.eventType} event is cached.`);
    }

    return this.eventType === EventType.CT ? currentEvent.id : currentEvent.name;
  }
}
