import {
  DailyChallengeBody,
  DailyChallengeSetBody,
  DailyChallengeSetMeta,
  DailyChallengeDifficulties,
  EventType,
  MetaData,
  NKData,
  DailyChallengeDifficulty,
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { getNumberForEvent } from "@btd6/helpers";
import { getData } from "@lib";
import { BaseEventCache } from "./events.cache.base";


export class DailyChallengeCache extends BaseEventCache<DailyChallengeSetBody, DailyChallengeSetMeta> {

  protected readonly eventType = EventType.Challenge;
  protected readonly url = API_URLS.ChallengeDaily;

  protected override async getEventData(): Promise<DailyChallengeSetBody[]> {

    const data = await getData<NKData<DailyChallengeBody>>(this.url);

    const now = Date.now();

    const challenges = {} as Record<Lowercase<DailyChallengeDifficulty>,
      {
        number: number;
        challenge: DailyChallengeBody;
      }
    >;

    for (const type of DailyChallengeDifficulties) {

      const number = getNumberForEvent(now, type);

      const challenge = data.body.find(event =>
        event.name.startsWith(
          `${type} ${number}:`
        )
      );

      if (!challenge) throw new Error(`Could not find ${type} Daily Challenge ${number}`);
      
      const key = type.toLowerCase() as Lowercase<DailyChallengeDifficulty>;

      challenges[key] = {
        number,
        challenge,
      };
    }


    return [{
      id: [
        challenges.standard.challenge.id,
        challenges.advanced.challenge.id,
      ].join(":"),
      name:
        `Standard ${challenges.standard.number} / ` +
        `Advanced ${challenges.advanced.number}`,
      start: 0,
      end: 0,
      Standard: challenges.standard,
      Advanced: challenges.advanced,
    }];
  }


  protected override getCurrentEvent(
    events: DailyChallengeSetBody[],
    _now: number,
    _getLatest?: boolean
  ): DailyChallengeSetBody | undefined {

    return events[0];
  }


  protected override async getMetaData(
    event: DailyChallengeSetBody
  ): Promise<DailyChallengeSetMeta> {

    const [standard, advanced] = await Promise.all([
      getData<MetaData>(event.Standard.challenge.metadata),
      getData<MetaData>(event.Advanced.challenge.metadata),
    ]);


    return {
      Standard: standard.body,
      Advanced: advanced.body,
    };
  }


  public override getBucketPath(
    _event: DailyChallengeSetBody
  ): string {

    const date = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());

    return `Event/DailyChallenge/${date}/event.json`;
  }
}