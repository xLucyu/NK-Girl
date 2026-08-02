import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { InteractionType } from "../base.command";
import { LeaderboardProfile } from "./leaderboard.profile";
import { eventManager } from "@manager";
import {
  BuildButtonMenu,
  CreateComponentState,
  componentState,
  scheduleComponentCleanup,
  render,
  type ComponentState,
  type BaseOptions,
} from "@components";
import {
  EventType,
  MEDALS,
  type LeaderboardPayload,
  type MedalsMode,
} from "@utils";

export const PAGE_SIZE = 10;

export type LeaderboardType = EventType.Race | EventType.Boss | EventType.CT;

export interface LeaderboardQuery {
  type: LeaderboardType;
  eventName: string;
  subTitle: string;
}

export interface LeaderboardData {
  query: LeaderboardQuery;
  medalsMode: MedalsMode;
  data: LeaderboardPayload;
}

export interface LeaderboardOptions extends BaseOptions {
  page: number;
}


export abstract class BaseLeaderboard {
 
  public abstract readonly eventType: LeaderboardType;

  public async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();

   // const leaderboard = await this.resolveLeaderboard(interaction);
  }

  private getMedal(mode: MedalsMode, position: number, totalScores: number): string | null {

    const percentile = position / totalScores;

    for (const entry of MEDALS[mode]) {
      const value = entry.max >= 1 ? position : percentile
      if (value >= entry.min && value <= entry.max) return entry.medal;
    };

    return null;
  }

  public async renderAndReply(interaction: InteractionType, state: ComponentState): Promise<void> {

  }

  private buildComponents(page: number, totalPages: number): InteractionEditReplyOptions["components"] {

    if (totalPages <= 1) return [];

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "leaderboard:page:previous",
            label: "<-", // placeholder
            style: ButtonStyle.Primary,
            disabled: page <= 1
          },
          {
            customId: "leaderboard:page:next",
            label: "->",
            style: ButtonStyle.Primary,
            disabled: page >= totalPages - 1 
          },
          {
            customId: "leaderboard:modal:player",
            label: "Search",
            style: ButtonStyle.Secondary
          },
          {
            customId: "leaderboard:modal:position",
            label: "Position",
            style: ButtonStyle.Secondary
          }
        ]
      })
    ];
  }

  protected resolveEventName(interaction: ChatInputCommandInteraction): string {

    const selectedOption = interaction.options.getString("event");
    if (selectedOption) return selectedOption;

    const currentEvent = eventManager.getEventCache(this.eventType).getCache()?.currentEvent.data!;

    return this.eventType === EventType.CT ? currentEvent.id : currentEvent?.name;
  }

  protected abstract resolveLeaderboard(interaction: ChatInputCommandInteraction): Promise<LeaderboardData | null>;
}
