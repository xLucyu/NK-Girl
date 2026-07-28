import { ChatInputCommandInteraction } from "discord.js";
import { BaseLeaderboard, LeaderboardConfigInput } from "../base.leaderboard";
import { getData } from "@api";
import { 
  GOOGLE_API_ULRS, 
  EventType, 
  addUnderscore, 
  type LeaderboardPayload 
} from "@utils";

export class RaceLeaderboard extends BaseLeaderboard {

  protected buildConfig(interaction: ChatInputCommandInteraction): LeaderboardConfigInput {

    const event = interaction.options.getString("event", true);

    return {
      type: EventType.Race,
      eventName: event,
      fetchLeaderboard: () => this.fetchLeaderboard(event),
    };
  }

  private async fetchLeaderboard(event: string): Promise<LeaderboardPayload | null> {
    const url = GOOGLE_API_ULRS.RaceLeaderboard
      .replace("{event}", addUnderscore(event));
    return getData<LeaderboardPayload>(url);
  }
}
