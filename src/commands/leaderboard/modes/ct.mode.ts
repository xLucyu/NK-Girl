import type { ChatInputCommandInteraction } from "discord.js";
import { LeaderboardModeResolver } from "./base.mode-resolver";
import { EventType, getNumberForEvent } from "@btd6";
import type { LeaderboardData } from "../base.leaderboard";

type CTMode = "Player" | "Team";

export class CtLeaderboard extends LeaderboardModeResolver {
  
  public readonly eventType = EventType.CT;

  public async resolve(interaction: ChatInputCommandInteraction): Promise<LeaderboardData | null> {
    const mode = interaction.options.getString("mode", true) as CTMode;
    const data = await this.resolveLeaderboard(
      interaction,
      event => `Leaderboard/CT/${event}/${mode.toLowerCase()}/leaderboard.json`,
    );
    if (!data) return null;

    const ctNumber = getNumberForEvent(data.start, this.eventType);
    return {
      query: {
        type: this.eventType,
        eventName: data.id,
        subTitle: `CT #${ctNumber} ${mode}`,
      },
      medalsMode: mode,
      data,
    };
  }
}
