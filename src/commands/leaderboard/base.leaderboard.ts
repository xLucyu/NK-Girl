import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ModalBuilder,
  type InteractionEditReplyOptions,
} from "discord.js";

import type { InteractionType } from "../base.command";
import { LeaderboardProfile } from "./leaderboard.profile";
import { eventManager } from "@manager";

import {
  BuildButtonMenu,
  BuildModalMenu,
  CreateComponentState,
  componentState,
  render,
  scheduleComponentCleanup,
  type BaseOptions,
  type ComponentState,
} from "@components";

import {
  EventType,
  MEDALS,
  type LeaderboardPayload,
  type MedalsMode,
  type Team,
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

export interface LeaderboardOptions extends BaseOptions, LeaderboardData {
  offset: number;
  pageSize: number;
  total: number;
}


export interface LeaderboardRow extends Team {
  medal: string | null;
}

export abstract class BaseLeaderboard {

  public abstract readonly eventType: LeaderboardType;

  protected abstract resolveLeaderboard(
    interaction: ChatInputCommandInteraction,
  ): Promise<LeaderboardData | null>;


  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    await interaction.deferReply();

    const leaderboard = await this.resolveLeaderboard(interaction);

    if (!leaderboard || leaderboard.data.teams.length === 0) {
      await interaction.editReply({
        content: "No leaderboard data was found.",
        components: [],
      });
      return;
    }

    const state = CreateComponentState<LeaderboardOptions>({
      event: leaderboard.query.eventName,
      options: {
        ...leaderboard,
        offset: 0,
        pageSize: PAGE_SIZE,
        total: leaderboard.data.teams.length,
      },
      userId: interaction.user.id,
    });


    await this.renderAndReply(interaction, state);

    const message = await interaction.fetchReply();
    componentState.set(message.id, state);

    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (options) => interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => componentState.delete(message.id),
    });
  }

    public async renderAndReply(
    interaction: InteractionType,
    state: ComponentState,
  ): Promise<void> {

    const options = state.options as LeaderboardOptions;

    const total = options.data.teams.length;
    const maxOffset = Math.max(0, total - PAGE_SIZE);
    const offset = Math.min(Math.max(0, Math.trunc(Number(options.offset) || 0)), maxOffset);

    options.offset = offset;
    options.total = total;
    options.pageSize = PAGE_SIZE;

    const rows = this.prepareRows(options.data, options.medalsMode, offset);

    const profile = LeaderboardProfile({
      type: options.query.type,
      subtitle: options.query.subTitle,
      scoringType: options.data.scoringType,
      rows,
    });

    const buffer = await render(profile);
    const attachment = new AttachmentBuilder(buffer, { name: "leaderboard.png" });

    await interaction.editReply({
      attachments: [],
      files: [attachment],
      components: this.getComponents(offset, total),
    });
  }


  public static buildModal(key: string): ModalBuilder | null {

    if (key !== "search") return null;

    return BuildModalMenu({
      customId: "leaderboard:modal:search:submit",
      title: "Search Leaderboard",
      inputId: "input",
      inputLabel: "Player name or placement",
      placeholder: "e.g. Blastapopolous or 42",
    });
  }

  public handleModal(
    state: ComponentState,
    key: string,
    input: string,
  ): boolean {

    if (key !== "search") return false;

    const options = state.options as LeaderboardOptions;
    const page = this.findPage(options.data, input);

    if (page === null) return false;
    return true;
  }

  private findPage(data: LeaderboardPayload, input: string): number | null {

    const needle = input.trim();
    if (!needle) return null;

    const asNumber = Number(needle);

    const index = Number.isInteger(asNumber) && asNumber > 0
      ? data.teams.findIndex((team) => team.position === asNumber)
      : data.teams.findIndex((team) =>
          team.members.some((member) =>
            member.displayName.toLowerCase().includes(needle.toLowerCase()),
          ),
        );

    return index === -1 ? null : Math.floor(index / PAGE_SIZE);
  }

  private prepareRows(
    data: LeaderboardPayload,
    medalsMode: MedalsMode,
    offset: number,
  ): LeaderboardRow[] {

    const totalScores = data.totalScores || data.teams.length;

    return data.teams
      .slice(offset, offset + PAGE_SIZE)
      .map((team) => ({
        ...team,
        medal: this.getMedal(medalsMode, team.position, totalScores),
      }));
  }


  private getMedal(
    mode: MedalsMode,
    position: number,
    totalScores: number,
  ): string | null {

    if (position < 1 || totalScores < 1) return null;

    const percentile = position / totalScores;

    for (const entry of MEDALS[mode]) {

      const isPercentile = entry.min < 1;

      const matches = isPercentile
        ? percentile > entry.min && percentile <= entry.max
        : position >= entry.min && position <= entry.max;

      if (matches) return entry.medal;
    }

    return null;
  }
  
  private getComponents(
    page: number,
    totalPages: number,
  ): InteractionEditReplyOptions["components"] {

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "leaderboard:page:previous",
            label: "Previous",
            style: ButtonStyle.Primary,
            disabled: page === 0,
          },
          {
            customId: "leaderboard:page:next",
            label: "Next",
            style: ButtonStyle.Primary,
            disabled: page >= totalPages - 1,
          },
          {
            customId: "leaderboard:modal:search",
            label: "🔍 Search",
            style: ButtonStyle.Primary,
          },
        ],
      }),
    ];
  }

  protected resolveEventName(interaction: ChatInputCommandInteraction): string {

    const selected = interaction.options.getString("event");
    if (selected) return selected;

    const currentEvent = eventManager
      .getEventCache(this.eventType)
      .getCache()
      ?.currentEvent.data;

    if (!currentEvent) {
      throw new Error(`No current ${this.eventType} event is cached.`);
    }

    return this.eventType === EventType.CT ? currentEvent.id : currentEvent.name;
  }
}
