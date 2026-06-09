export class BotError extends Error {
  constructor(public title: string, public userMessage: string) {
    super(userMessage);
    this.name = new.target.name;
  }
}

export class CommandOnCooldown extends BotError {
  constructor(seconds: number) {
    super(
      "Command on Cooldown",
      `You can use this command again in ${seconds} seconds.`
    )
  }
}

export class MissingPermission extends BotError {
  constructor() {
    super(
      "Missing Permissions",
      "You don't have the required permissions to run this command."
    )
  }
}

export class TileNotFound extends BotError {
  constructor() {
    super(
      "Tile Code not found",
      "The tile code you entered wasn't found. Please check your typing."
    );
  }
}

export class CTNotFound extends BotError {
  constructor() {
    super(
      "CT Event not found",
      "This CT event does not exist."
    );
  }
}

export class ChallengeCodeNotFound extends BotError {
  constructor() {
    super(
      "Challenge Code not found",
      "The challenge you were looking for does not exist."
    );
  }
}

export class RequestNoSuccess extends BotError {
  constructor() {
    super(
      "Invalid Request",
      "The bot was unable to fetch data from the API. Please try again."
    );
  }
}

export class ServerDown extends BotError {
  constructor() {
    super(
      "API Server Down",
      "The bot is online, but cannot receive API information."
    );
  }
}

export class InvalidTimeFormat extends BotError {
  constructor() {
    super(
      "Invalid Time Format",
      "Please make sure you're following the time format. Negative times are also not allowed!"
    );
  }
}

export class InvalidStartRound extends BotError {
  constructor() {
    super(
      "Invalid Start Round",
      "The Start Round can't be higher than the End Round."
    );
  }
}

export class StartRoundOutOfBounds extends BotError {
  constructor() {
    super(
      "Invalid Start Round",
      "The Start Round has to be between 1 and 139."
    );
  }
}

export class EndRoundOutOfBounds extends BotError {
  constructor() {
    super(
      "Invalid End Round",
      "The End Round has to be between 2 and 140."
    );
  }
}

export class GoalTimeTooLow extends BotError {
  constructor() {
    super(
      "Invalid Goal Time",
      "You entered an impossible time to achieve."
    );
  }
}

export class NoChannelSet extends BotError {
  constructor() {
    super(
      "No Channel Set",
      "Please add this event to a channel first before deleting it."
    );
  }
}