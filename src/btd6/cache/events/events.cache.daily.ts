import { DailyChallengeBody, DailyChallengeType, EventType, MetaBody, MetaData } from "@btd6/types";
import { BaseEventCache } from "./events.cache.base";
import { getNumberForEvent } from "@btd6/helpers";
import { API_URLS } from "@btd6/constants";
import { getData } from "@lib";

export class DailyChallengeCache extends BaseEventCache<DailyChallengeBody, MetaBody> {

  protected eventType = EventType.DailyChallenge;
  protected url = API_URLS.ChallengeDaily;

  constructor(private readonly challengeType: DailyChallengeType) {
    super();
  }

  protected override getCurrentEvent(events: DailyChallengeBody[], now: number, getLatest?: boolean): DailyChallengeBody | undefined {
    
    const eventNumber = getNumberForEvent(now, this.eventType);
    return events.find(event => this.getChallenge(event.name, this.challengeType, eventNumber));
  }

  private getChallenge(name: string, type: DailyChallengeType, eventNumber: number): boolean {

    const prefix = {
      Standard: `Standard ${eventNumber}:`,
      Advanced: `Advanced ${eventNumber}:`,
      Coop: `Coop ${eventNumber}:`,
    }[type];

    return name.startsWith(prefix);
  }

  protected async getMetaData(event: DailyChallengeBody): Promise<MetaBody> {
    const data = await getData<MetaData>(event.metadata);
    return data.body;
  }

  public getBucketPath(event: DailyChallengeBody): string {
    return `Challenge/${this.challengeType}/${event}/event.json`;
  }
}