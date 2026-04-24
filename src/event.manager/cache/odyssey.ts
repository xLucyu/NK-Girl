import { getData } from "../../api/wrapper";
import { URLS } from "../../utils/assets";
import { 
    MapsData,
    Odyssey, 
    OdysseyBody, 
    OdysseyMetaData
} from "../../utils/types";
import { BaseEventCache, EventType } from "./base";

const OdysseyDifficulties = ["Easy", "Medium", "Hard"] as const;
export type OdysseyDifficulty = typeof OdysseyDifficulties[number];

export class OdysseyCache extends BaseEventCache<OdysseyBody, Record<OdysseyDifficulty, OdysseyMetaData>> {

    protected eventType= EventType.Odyssey;
    protected url = URLS.Odyssey;
  
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


    protected async getMetaData(event: OdysseyBody): Promise<Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MapsData }>> {

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
                        mapsData,
                    },
                ] as const;
            })
        )
        return Object.fromEntries(entries) as Record<OdysseyDifficulty, OdysseyMetaData & { mapsData: MapsData }>;
    }
}