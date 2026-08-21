import { BaseEventCache } from "./events.cache.base";
import { 
  EventType, 
  MetaBody, 
  MetaData, 
  RaceBody 
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { addUnderscore, getData } from "@lib";

export class RaceCache extends BaseEventCache<RaceBody, MetaBody> {

  protected eventType: EventType = EventType.Race;
  protected url = API_URLS.Race;
    
  protected async getMetaData(event: RaceBody): Promise<MetaBody> {
        
    const data = await getData<MetaData>(event.metadata);
    return data.body as MetaBody;
  }

  public getBucketPath(event: RaceBody): string {
    return `Event/Race/${addUnderscore(event.name)}/event.json`;
  }
}