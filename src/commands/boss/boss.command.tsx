import { SlashCommandBuilder } from "discord.js";
import { eventManager } from "../../event.manager/manager";
import { EventCacheEntry, EventType } from "../../event.manager/cache/base";
import { BaseCommand } from "../base.command";
import { BossDifficulties, BossDifficulty } from "../../event.manager/cache";
import { BossBody, MetaBody } from "../../utils/types";
import { JSX } from "react";
import { BossProfile } from "./boss.profile";

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
