import * as boss from "./boss/boss.command";
import * as sync from "./sync/sync.command";
import * as help from "./help/help.command";

export const eventCommands = {
    boss: new boss.BossCommand(),
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