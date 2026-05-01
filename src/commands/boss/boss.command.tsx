import { SlashCommandBuilder } from "discord.js";
import type { JSX } from "react";
import { 
  eventManager,
  BossDifficulty,
  BossDifficulties,
  EventType,
  EventCacheEntry
} from "../../event.manager";
import { BaseCommand } from "../base.command";
import type { BossBody, MetaBody } from "../../utils/types";

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
    
  }

  protected getEventProps(): EventCacheEntry<BossBody, Record<"Standard" | "Elite", MetaBody>> | null {
    return eventManager.getCache(EventType.Boss)
  }

}
