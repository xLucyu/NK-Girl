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
  snapToPage,
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

  // ── Factory ─────────────────────────────────────────────────────────────

  /**
   * Turns fetched data into a live, paginated message. Expects the reply to
   * be deferred already. A null/empty payload produces the fallback reply.
   */
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

  // ── Rendering ───────────────────────────────────────────────────────────

  /** Entry point for the component router after paging or a modal submit. */
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

    /*
     * Pagination, medals and the search highlight are all resolved here,
     * before the profile receives the rows.
     */
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

  // ── Modals ──────────────────────────────────────────────────────────────

  /** Must stay an instance method — the router calls it on the registry object. */
  public buildModal(key: string): ModalBuilder | null {

    if (key === "search") {
      return BuildModalMenu({
        customId: "leaderboard:modal:search:submit",
        title: "Search Player",
        inputId: "input",
        inputLabel: "Player name",
        placeholder: "e.g. Blastapopolous",
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

  /** Returns false when nothing matched, so the router can reply ephemerally. */
  public handleModal(
    state: ComponentState,
    key: string,
    input: string,
  ): boolean {

    const options = state.options as LeaderboardOptions;

    const index =
      key === "search"   ? this.findByName(options.data, input) :
      key === "position" ? this.findByPosition(options.data, input) :
                           null;

    if (index === null) return false;

    options.highlight = index;
    snapToPage(state, index);

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

    /*
     * Ties and gaps mean not every number the user types exists as a literal
     * position — fall back to the row at that offset.
     */
    return position <= data.teams.length ? position - 1 : null;
  }

  // ── Rows & medals ───────────────────────────────────────────────────────

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
      /*
       * Percentile brackets have a fractional minimum (0.10, 0.25, 0.75);
       * placement brackets start at whole numbers (1, 4, 51). The check has
       * to look at `min` — a percentile bracket can legitimately have
       * max === 1.00, which would otherwise look like a placement range.
       */
      const isPercentile = entry.min < 1;

      const matches = isPercentile
        ? percentile > entry.min && percentile <= entry.max
        : position >= entry.min && position <= entry.max;

      if (matches) return entry.medal;
    }

    return null;
  }

  // ── Components ──────────────────────────────────────────────────────────

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
            label: "Previous",
            style: ButtonStyle.Primary,
            disabled: offset === 0,
          },
          {
            customId: "leaderboard:page:current",
            label: `${offset + 1}–${last} of ${total.toLocaleString("en-US")}`,
            style: ButtonStyle.Secondary,
            disabled: true,
          },
          {
            customId: "leaderboard:page:next",
            label: "Next",
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
