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