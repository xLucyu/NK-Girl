import { BotError } from "./error.bot-error";

export class TileNotFound extends BotError {
  constructor() {
    super(
      "Tile Code not Found",
      "The Code you enterend doesn't exist in this CT Event"
    )
  }
}