import { getData } from "@wrapper";
import { 
    API_URLS,
    EventType,
    MapsData,
    MetaBody,
    Odyssey, 
    OdysseyBody, 
    OdysseyMetaData,
    OdysseyDifficulty,
    OdysseyDifficulties
} from "@utils";
import { BaseEventCache } from "./base";


export class OdysseyCache extends BaseEventCache<OdysseyBody, Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>> {

    protected eventType= EventType.Odyssey;
    protected url = API_URLS.Odyssey;
  
    protected getCurrentActiveEvent(events: OdysseyBody[], now: number, firstUse: boolean): OdysseyBody {

        let currentEvent: OdysseyBody | undefined;
        
        if (firstUse) {
            currentEvent = events[0];
        } else {
            currentEvent = events.find((event) => event.end > now);
        }

        if (!currentEvent) throw new Error;
        return currentEvent;
    }


    protected async getMetaData(event: OdysseyBody): Promise<Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MetaBody[] }>> {

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

    protected getBucketPath(event: OdysseyBody): string {
        return `Event/Odyssey/${event.id}/event.json`;
    }
}