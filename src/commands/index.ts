import * as boss from "./boss/boss.command";
import * as boss_details from "./boss/boss-details.command";
import * as sync from "./sync/sync.command";
import * as help from "./help/help.command";
import * as race from "./race/race.command";
import * as odyssey from "./odyssey/odyssey.command";
import * as tile from "./ct/tile.command";

export const eventCommands = {
  boss: new boss.BossCommand(),
  boss_details: new boss_details.BossDetailsCommand(),
  race: new race.RaceCommand(),
  odyssey: new odyssey.OdysseyCommand(),
  tile: new tile.TileCommand()
}

export const helperCommands = {
  sync: new sync.SyncCommand(),
  help: new help.HelpCommand()
}

export const commands = {
  ...eventCommands,
  ...helperCommands
}

export * from "./interaction";
export * from "./base.command";
export * from "./cooldown";
