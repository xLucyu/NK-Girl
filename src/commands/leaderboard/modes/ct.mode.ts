import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardConfigInput } from "../base.leaderboard";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload
 } from "@utils";
import { getData } from "@api";

export class CtLeaderboard extends BaseLeaderboard {

  protected buildConfig(interaction: ChatInputCommandInteraction): LeaderboardConfigInput {

    const event = interaction.options.getString("event", true);
    const mode = interaction.options.getString("mode", true);

    return {
      type: EventType.CT,
      eventName: event,
      subtitle: mode,
      difficulty: mode,
      fetchLeaderboard: () => this.fetchLeaderboard(event, mode),
    };
  }

  private fetchLeaderboard(
    event: string,
    mode: string,
  ): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.CTLeaderboard
      .replace("{event}", addUnderscore(event))
      .replace("{mode}",  mode);
    return getData<LeaderboardPayload>(url);
  }
}
