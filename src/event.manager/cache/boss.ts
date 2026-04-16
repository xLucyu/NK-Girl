import { BossBody, MetaData, NkData } from "../../utils/types";
import { BaseEventCache } from "./base";
import { getData } from "../../api/wrapper";
import { URLS } from "../../utils/assets";

export class BossCache extends BaseEventCache<BossBody, MetaData> {

    protected async getEventData(): Promise<BossBody[]> {

       const data = await getData<NkData<BossBody>>(URLS.Boss.base)
       return data.body 
       
    }
}
