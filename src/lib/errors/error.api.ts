import { BotError } from "./error.bot-error";

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

export class EventNotFound extends BotError {
  constructor() {
    super(
      "Event Not Found",
      "The Bot couldn't fetch the event you were looking for."
    )
  }
}