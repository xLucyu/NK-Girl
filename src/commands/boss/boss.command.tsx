import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { JSX } from "react";
import { eventManager } from "@manager/manager";
import { 
  EventCacheEntry,
  BossDifficulties, 
  BossDifficulty 
} from "@manager/cache";
import { BaseCommand } from "@commands/base.command";
import { BossBody, EventType, MetaBody } from "@utils/types";
import { BossProfile } from "./boss.profile";

export type BossProps = EventCacheEntry<BossBody, Record<"Standard" | "Elite", MetaBody>>

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

  protected getProfile(interaction: ChatInputCommandInteraction, eventProps: BossProps): JSX.Element {

    const difficulty = interaction.options.getString("difficulty") as BossDifficulty ?? BossDifficulties[0];
    const event = eventProps.currentEvent.data;
    const metaData = eventProps.currentEvent.metaData[difficulty]

    if (!metaData) return <div></div>;
    return BossProfile({
      event,
      metaData,
      difficulty
    })
  }

  protected getEventProps(): EventCacheEntry<BossBody, Record<BossDifficulty, MetaBody>> | null {
    return eventManager.getEventCache(EventType.Boss).getCache();
  }
}
