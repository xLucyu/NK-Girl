import {
  AttachmentBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { InteractionType } from "../base.command";
import { LeaderboardProfile } from "./leaderboard.profile";
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

export type LeaderboardType = EventType.Race | EventType.Boss | EventType.CT;

export interface LeaderboardConfigInput {
  type: LeaderboardType;
  eventName: string;
  subtitle?: string;
  difficulty?: string;
  fetchLeaderboard: () => Promise<LeaderboardPayload | null>;
}

export interface LeaderboardConfig extends LeaderboardConfigInput {
  interaction: ChatInputCommandInteraction;
}

interface LeaderboardOptions extends BaseOptions {
  currentPage: number;
  type: LeaderboardType;
  subtitle: string;
  data: LeaderboardPayload;
  medalsMode: MedalsMode;
}

const PAGE_SIZE = 25;

export abstract class BaseLeaderboard {

  protected abstract buildConfig(
    interaction: ChatInputCommandInteraction,
  ): LeaderboardConfigInput;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const input = this.buildConfig(interaction);
    await this.createLeaderboard({ interaction, ...input });
  }

  protected async createLeaderboard(config: LeaderboardConfig): Promise<void> {

    await config.interaction.deferReply();

    const data = await config.fetchLeaderboard();
    if (!data || data.teams.length === 0) {
      await config.interaction.editReply({
        content: `No leaderboard found for ${config.type} "${config.eventName}".`,
      });
      return;
    }

    const medalsMode = BaseLeaderboard.getMedalsMode(config.type, config.difficulty);

    const state = CreateComponentState({
      event: config.eventName,
      options: {
        currentPage: 0,
        type: config.type,
        subtitle: config.subtitle ?? "",
        data,
        medalsMode,
      },
      userId: config.interaction.user.id,
    });

    await this.renderAndReply(config.interaction, state);

    const message = await config.interaction.fetchReply();
    componentState.set(message.id, state);

    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (opts) => config.interaction.editReply(opts),
      expiresAt: state.expiresAt,
      onExpire: () => componentState.delete(message.id),
    });
  }

  public async renderAndReply(interaction: InteractionType, state: ComponentState): Promise<void> {

    const { data, currentPage, type, subtitle, medalsMode } = state.options as LeaderboardOptions;

    const totalPages = Math.max(1, Math.ceil(data.teams.length / PAGE_SIZE));
    const page = Math.min(Math.max(0, currentPage), totalPages - 1);

    const profile = LeaderboardProfile({
      data,
      type,
      subtitle,
      medalsMode,
      page,
      pageSize: PAGE_SIZE,
    });

    const buffer = await render(profile);
    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    const components = this.getComponents(page, totalPages);

    await interaction.editReply({ files: [attachment], components });
  }

  public searchAndJump(state: ComponentState, query: string): number | null {

    const options = state.options as LeaderboardOptions;
    const needle = query.trim().toLowerCase();
    if (!needle) return null;

    const teams = options.data.teams;
    const matchIndex = teams.findIndex((team) =>
      team.members.some((m) => m.displayName.toLowerCase().includes(needle)),
    );

    if (matchIndex === -1) return null;

    options.currentPage = Math.floor(matchIndex / PAGE_SIZE);
    return options.currentPage;
  }

  private getComponents(
    page: number,
    totalPages: number,
  ): InteractionReplyOptions["components"] {
    return [
      BuildButtonMenu({
        buttons: [
          {
            customId: "leaderboard:currentPage:previous",
            label: "◀",
            style: ButtonStyle.Secondary,
            disabled: page <= 0,
          },
          {
            customId: "leaderboard:currentPage:next",
            label: "▶",
            style: ButtonStyle.Secondary,
            disabled: page >= totalPages - 1,
          },
          {
            customId: "leaderboard:openSearch",
            label: "🔍 Search",
            style: ButtonStyle.Primary,
          },
        ],
      }),
    ];
  }

  public static getMedalsMode(type: LeaderboardType, difficulty?: string): MedalsMode {

    switch (type) {
      case EventType.Boss: return difficulty === "Elite" ? "Elite" : "Standard";
      case EventType.CT: return difficulty === "Team"  ? "CTteam" : "CTplayer";
      case EventType.Race: return "Race";
    }
  }

  public static getMedal(
    mode: MedalsMode,
    position: number,
    totalTeams: number,
  ): string | null {
    if (position < 1 || totalTeams < 1) return null;

    const brackets = MEDALS[mode];
    const percentile = position / totalTeams;

    for (const entry of brackets) {
      const isPercentile = entry.min < 1 && entry.max <= 1;
      if (isPercentile) {
        if (percentile > entry.min && percentile <= entry.max) return entry.medal;
      } else {
        if (position >= entry.min && position <= entry.max) return entry.medal;
      }
    }
    return null;
  }
}
