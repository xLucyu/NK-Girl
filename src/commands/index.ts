import * as boss from "@commands/boss/boss.command";
import * as sync from "@commands/sync/sync.command";
import * as help from "@commands/help/help.command";

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