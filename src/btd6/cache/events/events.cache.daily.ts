import {
  DailyChallengeBody,
  DailyChallengeType,
  EventType,
  MetaBody,
  MetaData,
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { getNumberForEvent } from "@btd6/helpers";
import { getData } from "@lib";
import { BaseEventCache } from "./events.cache.base";

export class DailyChallengeCache extends BaseEventCache<DailyChallengeBody, MetaBody> {

  protected readonly eventType = EventType.DailyChallenge;
  protected readonly url = API_URLS.ChallengeDaily;

  constructor(private readonly challengeType: DailyChallengeType) {
    super();
  }

  protected override getCurrentEvent(
    events: DailyChallengeBody[],
    now: number,
    _getLatest?: boolean
  ): DailyChallengeBody | undefined {

    const number = getNumberForEvent(
      now,
      this.challengeType
    );

    return events.find(event =>
      event.name.startsWith(
        `${this.challengeType} ${number}:`
      )
    );
  }

  protected override async getMetaData(
    event: DailyChallengeBody
  ): Promise<MetaBody> {

    const data = await getData<MetaData>(
      event.metadata
    );

    return data.body;
  }

  public override getBucketPath(
    event: DailyChallengeBody
  ): string {

    const number = this.getChallengeNumber(
      event.name
    );

    return `Challenge/${this.challengeType}/${number}/event.json`;
  }

  private getChallengeNumber(
    name: string
  ): number {

    const match = name.match(
      /^(?:Standard|Advanced)\s+(\d+):/
    );

    if (!match) {
      throw new Error(
        `Invalid daily challenge name: ${name}`
      );
    }

    return Number(match[1]);
  }
}