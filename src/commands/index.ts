import { BossCommand } from "./boss/boss.command";
import { BossDetailsCommand } from "./boss/boss-details.command";
import { RaceCommand } from "./race/race.command";
import { OdysseyCommand } from "./odyssey/odyssey.command";
import { TileCommand } from "./ct/tile.command";
import { CollectionCommand } from "./collection/collection.command";
import { SyncCommand } from "./sync/sync.command";
import { HelpCommand } from "./help/help.command";

export const eventCommands = {
  boss: new BossCommand(),
  race: new RaceCommand(),
  odyssey: new OdysseyCommand(),
  boss_details: new BossDetailsCommand(),
  tile: new TileCommand(),
  collection: new CollectionCommand()
}

export const helperCommands = {
  sync: new SyncCommand(),
  help: new HelpCommand()
}

export const commands = {
  ...eventCommands,
  ...helperCommands
}

export * from "./interaction";
export * from "./base.command";
export * from "./cooldown";
