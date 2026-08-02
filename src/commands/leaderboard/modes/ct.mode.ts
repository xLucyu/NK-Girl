import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardData } from "../base.leaderboard";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload
 } from "@utils";
import { getData } from "@api";

type CTMode = "Player" | "Team";

export class CtLeaderboard extends BaseLeaderboard {

  public readonly eventType = EventType.CT;

  protected async resolveLeaderboard(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {

    const event = this.resolveEventName(interaction);
    const mode = interaction.options.getString("mode", true) as CTMode;

    const data = await this.fetchLeaderboard(event, mode);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: mode 
      },
      medalsMode: mode,
      data: data
    }
  }

  private async fetchLeaderboard(
    event: string,
    mode: string,
  ): Promise<LeaderboardPayload> {
    const url = GOOGLE_API_ULRS.CTLeaderboard
      .replace("{event}", addUnderscore(event))
      .replace("{mode}",  mode);
    return await getData<LeaderboardPayload>(url);
  }
}
