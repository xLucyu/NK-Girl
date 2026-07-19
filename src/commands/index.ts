import * as boss from "./boss/boss.command";
import * as bossdetails from "./boss/boss-details.command";
import * as sync from "./sync/sync.command";
import * as help from "./help/help.command";
import * as race from "./race/race.command";
import * as odyssey from "./odyssey/odyssey.command";

export const eventCommands = {
    boss: new boss.BossCommand(),
    race: new race.RaceCommand(),
    odyssey: new odyssey.OdysseyCommand(),
    bossdetails: new bossdetails.BossDetailsCommand()
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

export { BossProfile } from "./boss/boss.profile";
export { RaceProfile } from "./race/race.profile";
export { OdysseyProfile } from "./odyssey/odyssey.profile";
 