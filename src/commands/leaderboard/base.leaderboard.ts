import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ModalBuilder,
  type InteractionEditReplyOptions,
} from "discord.js";
import type { InteractionType } from "../base.command";
import { LeaderboardProfile } from "./leaderboard.profile";
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
import { LeaderboardModeResolver } from "./modes/base.mode-resolver";

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
  highlight: number | null;
}

export interface LeaderboardRow extends Team {
  medal: string | null;
  highlighted: boolean;
}

export abstract class BaseLeaderboard {

  protected async buildLeaderboard(
    interaction: ChatInputCommandInteraction,
    mode: LeaderboardModeResolver | null,
  ): Promise<void> {

    const leaderboard = (await mode?.resolve(interaction)) ?? null;

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
        highlight: null,
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
    const offset = Math.min(
      Math.max(0, Math.trunc(Number(options.offset) || 0)),
      maxOffset,
    );

    options.offset = offset;
    options.total = total;
    options.pageSize = PAGE_SIZE;


    const rows = this.prepareRows(
      options.data,
      options.medalsMode,
      offset,
      options.highlight ?? null,
    );

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

  public buildModal(key: string): ModalBuilder | null {

    if (key === "search") {
      return BuildModalMenu({
        customId: "leaderboard:modal:search:submit",
        title: "Search Player",
        inputId: "input",
        inputLabel: "Player name",
        placeholder: "e.g. lucy",
      });
    }

    if (key === "position") {
      return BuildModalMenu({
        customId: "leaderboard:modal:position:submit",
        title: "Jump to Placement",
        inputId: "input",
        inputLabel: "Placement",
        placeholder: "e.g. 42",
      });
    }

    return null;
  }

  public handleModal(state: ComponentState, key: string, input: string): boolean {

    const options = state.options as LeaderboardOptions;

    const index = key === "search" ? this.findByName(options.data, input) :
      key === "position" ? this.findByPosition(options.data, input) : null;

    if (index === null) return false;

    options.highlight = index;
    options.offset = Math.floor(index / PAGE_SIZE) * PAGE_SIZE;


    return true;
  }

  private findByName(data: LeaderboardPayload, input: string): number | null {

    const needle = input.trim().toLowerCase();
    if (!needle) return null;

    const index = data.teams.findIndex((team) =>
      team.members.some((member) =>
        member.displayName.toLowerCase().includes(needle),
      ),
    );

    return index === -1 ? null : index;
  }

  private findByPosition(data: LeaderboardPayload, input: string): number | null {

    const position = Number(input.trim());
    if (!Number.isInteger(position) || position < 1) return null;

    const index = data.teams.findIndex((team) => team.position === position);
    if (index !== -1) return index;
    console.log(position, index);

    return position <= data.teams.length ? position - 1 : null;
  }

  private prepareRows(
    data: LeaderboardPayload,
    medalsMode: MedalsMode,
    offset: number,
    highlight: number | null,
  ): LeaderboardRow[] {

    const totalScores = data.totalScores || data.teams.length;

    return data.teams
      .slice(offset, offset + PAGE_SIZE)
      .map((team, i) => ({
        ...team,
        medal: this.getMedal(medalsMode, team.position, totalScores),
        highlighted: highlight !== null && offset + i === highlight,
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
    offset: number,
    total: number,
  ): InteractionEditReplyOptions["components"] {

    const maxOffset = Math.max(0, total - PAGE_SIZE);
    const last = Math.min(offset + PAGE_SIZE, total);

    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "leaderboard:page:previous",
            label: "◀",
            style: ButtonStyle.Primary,
            disabled: offset === 0,
          },
          {
            customId: "leaderboard:page:next",
            label: "▶",
            style: ButtonStyle.Primary,
            disabled: offset >= maxOffset,
          },
          {
            customId: "leaderboard:modal:search",
            label: "🔍 Player",
            style: ButtonStyle.Secondary,
          },
          {
            customId: "leaderboard:modal:position",
            label: "# Position",
            style: ButtonStyle.Secondary,
          },
        ],
      }),
    ];
  }
}
