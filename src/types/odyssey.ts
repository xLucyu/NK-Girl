import { Tower } from "./metadata";
import { MetaBody } from "./metadata";

export interface MapsData {
  success: boolean;
  body: MetaBody[];
}

export interface OdysseyBody {
  id: string;
  isExtreme: boolean;
  maxMonkeySeats: number;
  maxMonkeysOnBoat: number;
  maxPowerSlots: number;
  startingHealth: number;
  _rewards: any[];
  _availablePowers: any[];
  _availableTowers: Tower[];
  maps: string;
}
export interface Odyssey {
  success: boolean;
  body: OdysseyBody;
}
