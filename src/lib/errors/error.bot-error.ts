export class BotError extends Error {

  public readonly title: string;
  public readonly userMessage: string;

  constructor(title: string, userMessage: string) {
    super(userMessage);
    this.title = title;
    this.userMessage = userMessage;

    this.name = new.target.name;
  }
}
