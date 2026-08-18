import { Command } from "@client";
import { BossCommand } from "./boss/boss.command";
import { BossDetailsCommand } from "./boss/boss-details.command";
import { BossRushCommand } from "./boss-rush/boss-rush.command";
import { RaceCommand } from "./race/race.command";
import { OdysseyCommand } from "./odyssey/odyssey.command";
import { TileCommand } from "./tile/tile.command";
import { CollectionCommand } from "./collection/collection.command";
import { SyncCommand } from "./sync/sync.command";
import { HelpCommand } from "./help/help.command";
import { LeaderboardCommand } from "./leaderboard/leaderboard.command";
import { ChannelCommand } from "./events/channel.command";
import { EventCommand } from "./events/events.command";
import { FeedbackCommand } from "./feedback/feedback.command";
import { UsageCommand } from "./sync/usage.command";

export const allCommands: Command[] = [
  new BossCommand(),
  new BossDetailsCommand(),
  new BossRushCommand(),
  new RaceCommand(),
  new OdysseyCommand(),
  new TileCommand(),
  new CollectionCommand(),
  new SyncCommand(),
  new HelpCommand(),
  new LeaderboardCommand(),
  new ChannelCommand(),
  new EventCommand(),
  new FeedbackCommand(),
  new UsageCommand()
]

export * from "./interaction";
export * from "./base.command";
export * from "./cooldown";
