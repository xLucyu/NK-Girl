import { BotError } from "./error.bot-error";

export class CommandOnCooldown extends BotError {
  constructor(seconds: number) {
    super(
      "Command on Cooldown",
      `You can use this command again in ${seconds} seconds.`
    );
  }
}

export class MissingGuildID extends BotError {
  constructor() {
    super(
      "Missing Guild ID",
      "This command can only be used in a Guild or the Guild was deleted."
    );
  }
}

export class MissingPermission extends BotError {
  constructor() {
    super(
      "Missing Permissions",
      "You don't have the required permissions to run this command."
    );
  }
}