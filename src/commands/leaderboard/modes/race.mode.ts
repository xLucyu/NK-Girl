import type { ChatInputCommandInteraction } from "discord.js";
import type { LeaderboardData } from "../base.leaderboard";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { EventType, getNumberForEvent } from "@btd6";
import { addUnderscore } from "@lib";

export class RaceLeaderboard extends LeaderboardModeResolver {
  
  public readonly eventType = EventType.Race;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData | null> {

    const data = await this.resolveLeaderboard(
      interaction,
      event => `Leaderboard/Race/${addUnderscore(event)}/leaderboard.json`,
    );
    if (!data) return null;

    const raceNumber = getNumberForEvent(data.start, this.eventType);
    return {
      query: {
        type: this.eventType,
        eventName: data.name,
        subTitle: `Race #${raceNumber} ${data.name}`,
      },
      medalsMode: this.eventType,
      data,
    };
  }
}
