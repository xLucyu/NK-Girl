import { ChatInputCommandInteraction } from "discord.js";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { EventType, getNumberForEvent, GOOGLE_API_ULRS, LeaderboardPayload } from "@btd6";
import { LeaderboardData } from "../base.leaderboard";
import { addUnderscore, getData } from "@lib";


type CTMode = "Player" | "Team";

export class CtLeaderboard extends LeaderboardModeResolver {

  public readonly eventType = EventType.CT;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData> {

    const event = this.resolveEventName(interaction);
    const mode = interaction.options.getString("mode", true) as CTMode;

    const data = await this.fetchLeaderboard(event, mode);
    const ctNumber = getNumberForEvent(data.start, this.eventType);

    return {
      query: {
        type: this.eventType,
        eventName: event,
        subTitle: `CT #${ctNumber} ${mode}` 
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
