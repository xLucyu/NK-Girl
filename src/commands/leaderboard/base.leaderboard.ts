import { BaseOptions, BuildButtonMenu, ComponentState, componentState, CreateComponentState, render, scheduleComponentCleanup } from "@components";
import { EventType, LeaderboardPayload, MedalImages, MEDALS, MedalsMode } from "@utils";
import { AttachmentBuilder, ButtonStyle, ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";
import { InteractionType } from "../base.command";

type leaderboardType =  EventType.Race | EventType.Boss | EventType.CT

export interface LeaderboardConfig {
  interaction: ChatInputCommandInteraction;
  type: leaderboardType;
  eventName: string;
  subtitle?: string;
  fetchLeaderboard: () => Promise<LeaderboardPayload | null>;
  difficulty: string;
}

interface LeaderboardOptions extends BaseOptions {
  currentPage: number;
  type: leaderboardType;
  subtitle: string;
  data: LeaderboardPayload;
  medals: MedalsMode;
}

const PAGE_SIZE = 25;

export class BaseLeaderboard {

  protected async createLeaderboard(config: LeaderboardConfig): Promise<void> {

    await config.interaction.deferReply();

    const leaderboardData = await config.fetchLeaderboard();
    if (!leaderboardData || leaderboardData.teams.length === 0) throw new Error("Leaderboard not found.");

    const medalsMode = this.getMedalsMode(config.type, config.difficulty);

    const state = CreateComponentState({
      event: config.eventName,
      options: {
        currentPage: 0,
        type: config.type,
        subtitle: config.subtitle ?? "",
        data: leaderboardData,
        medals: medalsMode
      },
      userId: config.interaction.user.id
    });

    await this.renderPage(config.interaction, state);

    const message = await config.interaction.fetchReply();
    componentState.set(message.id, state);

    scheduleComponentCleanup({
      messageId: message.id,
      editReply: (options) => config.interaction.editReply(options),
      expiresAt: state.expiresAt,
      onExpire: () => {componentState.delete(message.id)},
    });
  }

  private async renderPage(interaction: InteractionType, state: ComponentState) {

    const { data, currentPage, type, subtitle, medalsMode } = state.options as LeaderboardOptions;

    const totalPages = Math.max(1, Math.ceil(data.teams.length / PAGE_SIZE));
    const page = Math.min(Math.max(0, currentPage), totalPages - 1);

    const profile = LeaderboardProfile({
      data,
      type,
      subtitle,
      medalsMode,
      page, 
      PAGE_SIZE
    })

    const buffer = await render(profile);
    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    const components = this.getComponents(page, totalPages);

    await interaction.editReply({ files: [attachment], components });

  }

  private getComponents(page: number, totalPages: number): InteractionReplyOptions["components"] {

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
          customId: "leaderboard:search",
          label: "🔍 Search",
          style: ButtonStyle.Primary,
        },
      ],
    }),
  ];
  }

  public static getMedal(mode: MedalsMode, position: number, totalTeams: number): string | null {

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

  private getMedalsMode(
    type: leaderboardType,
    difficulty: string,
  ): MedalsMode {
    switch (type) {
      case "Boss": return difficulty === "Elite" ? "Elite" : "Standard";
      case "CT": return difficulty === "Team" ? "CTteam" : "CTplayer";
      default: return "Race";
    }
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
}
