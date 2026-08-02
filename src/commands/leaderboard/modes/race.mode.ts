import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardData } from "../base.leaderboard";
import { getData } from "@api";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload 
} from "@utils";

export class RaceLeaderboard extends BaseLeaderboard {

  public readonly eventType = EventType.Race;

  protected async resolveLeaderboard(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {

    const event = this.resolveEventName(interaction);
    const data = await this.fetchLeaderboard(event);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: ""
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