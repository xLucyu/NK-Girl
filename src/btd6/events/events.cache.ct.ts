import { BaseEventCache, PreviousEvent } from "./events.cache.base";
import { 
  CTBody, 
  EventType, 
  TileCode 
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { getData } from "@lib";


export class CTCache extends BaseEventCache<CTBody, Record<string, TileCode>> {

  protected eventType= EventType.CT;
  protected url = API_URLS.CT;

  protected async getMetaData(event: CTBody): Promise<Record<string, TileCode>> {
     
    const eventNumber = getNumberForEvent(event.start, EventType.CT);
    const url = API_URLS.Tile.replace("{}", String(eventNumber));
    const data = await getData<Record<string,TileCode>>(url);
    return data;
  }


  protected override getPreviousEvents(): PreviousEvent[] {
    return [];
  }

  public getBucketPathKey(event: CTBody): string {
    return event.id;
  }
}