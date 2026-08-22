import { ChatInputCommandInteraction } from "discord.js";
import { LeaderboardData } from "../base.leaderboard";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { EventType, getNumberForEvent, GOOGLE_API_ULRS, LeaderboardPayload } from "@btd6";
import { addUnderscore, getData } from "@lib";

export class RaceLeaderboard extends LeaderboardModeResolver {

  public readonly eventType = EventType.Race;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {

    const event = this.resolveEventName(interaction);
    const data = await this.fetchLeaderboard(event);
    const raceNumber = getNumberForEvent(data.start, this.eventType);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: `Race #${raceNumber} ${data.name}`
      },
      medalsMode: this.eventType,
      data: data
    }
  }

  private async fetchLeaderboard(event: string): Promise<LeaderboardPayload> {
    const url = GOOGLE_API_ULRS.RaceLeaderboard.replace("{event}", addUnderscore(event));
    return getData<LeaderboardPayload>(url);
  }
}