import { JSX } from "react";
import { SlashCommandBuilder } from "discord.js";
import { BossProfile } from "./boss.profile";
import { eventManager } from "@manager/manager";
import { BaseCommand } from "../base.command";
import { 
    EventCacheEntry,
    BossDifficulties,
    BossDifficulty,
    EventType
} from "@manager/cache";
import { BossBody, MetaBody } from "@utils/types";

export class BossCommand extends BaseCommand<BossBody, Record<BossDifficulty, MetaBody>> {

  public commandData = new SlashCommandBuilder()
    .setName("boss")
    .setDescription("shows the boss data.")
    .addStringOption((option) =>
    option 
      .setName("difficulty")
      .setDescription("Choose a difficulty")
      .setRequired(false)
      .addChoices(
        ...BossDifficulties.map((difficulty) => ({
          name: difficulty,
          value: difficulty 
        }))
      )
    );

  protected getProfile(): JSX.Element {
    return BossProfile();
  }

  protected getEventProps(): EventCacheEntry<BossBody, Record<BossDifficulty, MetaBody>> | null {
    return eventManager.getEventCache(EventType.Boss).getCache();
  }
}