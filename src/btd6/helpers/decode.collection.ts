import { API_TOWER_ORDER } from "@btd6/constants";
import { InstaSchedule, RotationPage } from "@btd6/types";

const TWO64 = 1n << 64n;
const TWO63 = 1n << 63n;
const MOD_PM = 2147483647n;
const MOD_PM_MINUS1_NUM = 2147483646;

export interface EventData {
  id: string;
  start: number;
  end: number;
}

function toLong(num: bigint): bigint {
  let v = num & (TWO64 - 1n);
  if (v >= TWO63) {
    v -= TWO64;
  }
  return v;
}

function longAbs(num: bigint): bigint {
  if (num === -TWO63) {
    return num;
  }
  return num < 0n ? -num : num;
}

function I64(value: string): bigint {
  let result = 0n;

  for (const char of value) {
    const digit = BigInt(char.charCodeAt(0) - 48);
    result = toLong(toLong(result * 10n) + digit);
  }

  return result;
}

function getSeedLong(eventID: string): bigint {
  let subString = "";

  for (const char of eventID) {
    subString += String(char.charCodeAt(0));
  }

  if (subString.length > 18) {
    subString = subString.slice(0, 18);
  }

  const parsed = I64(subString);
  return longAbs(parsed);
}


class SeededRandom {

  private seed: bigint;

  constructor(seed: bigint) {
    this.seed = seed < 0n ? longAbs(seed) : seed;
  }

  next(): bigint {
    this.seed = toLong(this.seed * 16807n);
    this.seed = this.seed % MOD_PM;
    return this.seed;
  }

  nextFloat(): number {
    return Number(this.next()) / MOD_PM_MINUS1_NUM;
  }

  range(minVal: number, maxVal: number): number {
    if (minVal === maxVal) {
      return minVal;
    }

    const span = BigInt(maxVal - minVal);
    const r = this.next() % span;
    return minVal + Number(r);
  }
}

function shuffleSeed(seedLong: bigint, inputList: string[]): string[] {
  const rng = new SeededRandom(seedLong);
  const list = [...inputList];
  const length = list.length;

  for (let i = 0; i < length; i++) {
    const j = rng.range(i, length);

    if (j >= 0 && j < length) {
      [list[i], list[j]] = [list[j], list[i]];
    }
  }

  return list;
}

class CollectionEventHelper {
  public instasList: string[] = [];
  public getCurrentPageNumber: () => number = () => 0;

  getPossibleInstas(): string[] {
    const maxInstasPerPage = 4;
    const list = this.instasList;

    if (!list.length) {
      return [];
    }

    const totalCount = list.length;
    const pageSize = Math.ceil(totalCount * 0.25);

    let currentPage = this.getCurrentPageNumber();
    let outerIndex = 0;

    while (pageSize < currentPage) {
      currentPage -= pageSize;
      outerIndex += 1;
    }

    const pageItems: string[] = [];

    for (let i = 0; i < maxInstasPerPage; i++) {
      const rotIndex = (i + outerIndex + currentPage * maxInstasPerPage) % totalCount;
      pageItems.push(list[rotIndex]);
    }

    return pageItems;
  }
}

function timeStampToUTCTimeFormat(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

export function getCollectionCycle(eventData: EventData): InstaSchedule {
    
  const seed = getSeedLong(eventData.id);
  const secondsPerRotation = 28800; // 8 hours

  const maxPages = Math.ceil(
    (eventData.end - eventData.start) / (secondsPerRotation * 1000)
  );

  const shuffledInstas = shuffleSeed(seed, API_TOWER_ORDER);

  const helper = new CollectionEventHelper();
  helper.instasList = shuffledInstas;

  const rotationPages: Record<number, RotationPage> = {};

  for (let page = 0; page < maxPages; page++) {
    helper.getCurrentPageNumber = () => page;

    const timeStamp = eventData.start + page * secondsPerRotation * 1000;

    rotationPages[page] = {
      Instas: helper.getPossibleInstas(),
      TimeStamp: timeStampToUTCTimeFormat(timeStamp),
    };
  }

  return {
    Start: timeStampToUTCTimeFormat(eventData.start),
    End: timeStampToUTCTimeFormat(eventData.end),
    Rotations: rotationPages,
  };
}