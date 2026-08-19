import { BotError } from "./error.bot-error";

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