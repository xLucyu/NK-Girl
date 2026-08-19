export enum EventType {
  Boss = "Boss",
  BossRush = "BossRush",
  Race =  "Race",
  Odyssey = "Odyssey",
  Collection = "Collection",
  CT = "CT"
}

export interface BaseBody {
  id: string;
  name: string;
  start: number;
  end: number;
}

export interface EventBody extends BaseBody {
  type: string;
  url?: string | null;
}

export interface NKData<T> {
  success: boolean;
  body: T[];
}