import { BaseEventCache } from "./events.cache.base";
import { 
  EventType, 
  OdysseyDifficulties, 
  MapsData, 
  MetaBody, 
  Odyssey, 
  OdysseyBody, 
  OdysseyDifficulty, 
  OdysseyMetaData 
} from "@btd6/types";
import { API_URLS } from "@btd6/constants";
import { addUnderscore, getData } from "@lib";


export class OdysseyCache extends BaseEventCache<
  OdysseyBody, 
  Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>
  > {

  protected eventType = EventType.Odyssey;
  protected url = API_URLS.Odyssey;

  protected async getMetaData(event: OdysseyBody): Promise<
  Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>
  > {

    const entries = await Promise.all(
      OdysseyDifficulties.map(async (difficulty) => {
        const url = difficulty === "Easy" ? event.metadata_easy
          : difficulty === "Medium" ? event.metadata_medium
          : event.metadata_hard;
        const data = await getData<Odyssey>(url);
        const mapsData = await getData<MapsData>(data.body.maps)
        return [
          difficulty,
            {
              ...data.body,
              mapsData: mapsData.body,
            },
          ];
      })
    )
    return Object.fromEntries(entries) as Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>;
  }

  public getBucketPath(event: OdysseyBody): string {
    return `Event/Odyssey/${addUnderscore(event.name)}/event.json`;
  }
}