import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
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
  subtitle: string;
  difficulty?: string;
}

export interface LeaderboardConfig {
  query: LeaderboardQuery;
  fetch: () => Promise<LeaderboardPayload | null>;
}

export interface LeaderboardOptions extends BaseOptions {
  query: LeaderboardQuery;
  data: LeaderboardPayload;
  page: number;
}

export abstract class BaseLeaderboard {
 
  public abstract readonly eventType: LeaderboardType;

  public execute(interaction: ChatInputCommandInteraction) {

  }

  private getMedal() {

  }

  protected resolveEventName(interaction: ChatInputCommandInteraction): string {
    return interaction.options.getString("event") ? eventManager.getEventCache(this.eventType).getCache()!.currentEvent.data.name : ""
  }
}
