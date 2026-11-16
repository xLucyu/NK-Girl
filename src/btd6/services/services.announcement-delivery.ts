export interface DeliveryOperations<T> {
  hasRecorded(): Promise<boolean>;
  send(): Promise<T | null>;
  record(): Promise<void>;
  afterSend(message: T): Promise<void>;
}

/** Coordinates all announcement paths within this bot process. */
export class AnnouncementDelivery {
  private readonly inFlight = new Set<string>();
  // Only retain deliveries whose database recording failed.
  private readonly unrecorded = new Set<string>();

  public async run<T>(
    key: string,
    force: boolean,
    operations: DeliveryOperations<T>
  ): Promise<T | null> {
    if (this.inFlight.has(key)) return null;
    this.inFlight.add(key);

    try {
      if (this.unrecorded.has(key)) {
        await operations.record();
        this.unrecorded.delete(key);
        if (!force) return null;
      }

      if (!force && await operations.hasRecorded()) return null;

      const message = await operations.send();
      if (!message) return null;

      // Remember delivery immediately, even if recording fails.
      this.unrecorded.add(key);
      await operations.record();
      this.unrecorded.delete(key);

      // Crossposting must never decide whether the original message was sent.
      await operations.afterSend(message);
      return message;
    } finally {
      this.inFlight.delete(key);
    }
  }
}
