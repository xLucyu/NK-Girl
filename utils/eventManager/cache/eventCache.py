from asyncio import gather
from typing import Callable
from dataclasses import dataclass
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from api import wrapper
from cogs.profile import (
    raceProfile,
    bossProfile,
    odysseyProfile,
    collectionProfile,
)
from utils.dataclasses import (
    URLS,
    EventURLs,
    Events,
    EventBody
)
from helpers import ( 
    getCurrentTimeStamp,
    transformDataToDataClass
)
from utils.enums import EventType


@dataclass(frozen=True)
class EventCheck:
    Difficulties: list[str | None]
    Function: Callable | None
    Url: EventURLs
    Type: EventType

EVENTS_TO_CHECK: dict[str, EventCheck] = {

    "Race": EventCheck(
        Difficulties = [None],
        Function = raceProfile,
        Url = URLS["Race"],
        Type = EventType.Race
    ),
    "Boss": EventCheck(
        Difficulties = ["Standard", "Elite"],
        Function = bossProfile,
        Url = URLS["Boss"],
        Type = EventType.Boss
    ),
    "Odyssey": EventCheck(
        Difficulties = ["Easy", "Medium", "Hard"],
        Function = odysseyProfile,
        Url = URLS["Odyssey"],
        Type = EventType.Odyssey
    ),
    "Collection": EventCheck(
        Difficulties = [None],
        Function = collectionProfile,
        Url = URLS["Events"],
        Type = EventType.Collection
    ),
    "ContestedTerritory": EventCheck(
        Difficulties = [None],
        Function = None,
        Url = URLS["CT"],
        Type = EventType.ContestedTerritory
    ),
}


class EventManager:

    def __init__(self):

        self.scheduler = AsyncIOScheduler()
        self.currentEventCache: dict[str, dict] = {
            key: {} for key in EVENTS_TO_CHECK.keys()
        }

        self.apiCache: dict[str, dict] = {}
        self.cacheTTL = 3600 


    def getCurrentEventCache(self, eventName: str) -> dict | None:
        return self.currentEventCache.get(eventName, None)


    async def startScheduler(self):
        
        self.scheduler.add_job(self.checkForNewEvent, "cron", minute=0)
        self.scheduler.start()


    async def _fetch(self, url: str) -> dict:

        now = getCurrentTimeStamp()
        cache = self.apiCache.get(url)

        if cache and (now - cache["time"] < self.cacheTTL):
            return cache["data"]

        data = await wrapper.fetch(url)

        self.apiCache[url] = {
            "data": data,
            "time": now
        }

        return data


    def _getCurrentActiveEvent(self, mainData: Events, currentTimeStamp: int, eventType: str) -> EventBody:

        events = [
                event
                for event in mainData.body
                if event.type == eventType
        ]
        currentEvent = [
                event 
                for event in events
                if event.end > currentTimeStamp
        ]

        return min(currentEvent, key=lambda event: event.end) if currentEvent else events[0]


    async def _getPreviousEvents(self, event: EventCheck) -> list[str] | None:

        if not event.Url:
            return None

        data = await self._fetch(event.Url.base)
        return [event["id"] for event in data.get("body", [])]


    async def _getMetaData(self, event: EventCheck, currentEvent: EventBody) -> list | None:
         
        if not event.Url:
            return None

        urls = [
            event.Url.getExtension(difficulty)
            for difficulty in event.Difficulties
        ]

        return await gather(*(self._fetch(url) for url in urls))


    async def _buildEventData(self, key: str, event: EventCheck, currentEvent: EventBody) -> tuple[str, dict]:

        tasks = []

        if event.Url:
            tasks.append(self._getPreviousEvents(event))
            tasks.append(self._getMetaData(event, currentEvent))

        results = await gather(*tasks) if tasks else []

        previousEvents = results[0] if event.Url else None
        metaData = results[1] if event.Url else None

        return key, {
            "currentEvent": {
                "data": currentEvent,
                "metaData": metaData
            },
            "previousEvents": previousEvents,
        }


    async def checkForNewEvent(self) -> None:

        currentTimeStamp = getCurrentTimeStamp()
        rawData = await self._fetch(URLS["Events"].base)
        mainData = transformDataToDataClass(Events, rawData)

        tasks = []

        for key, event in EVENTS_TO_CHECK.items():

            currentEvent = self._getCurrentActiveEvent(mainData, currentTimeStamp, event.Type.value)

            cachedId = self.currentEventCache.get(key, {}).get("currentEvent", {}).get("id")

            if cachedId != currentEvent.id:
                tasks.append(self._buildEventData(key, event, currentEvent))

        if not tasks:
            return 

        results = await gather(*tasks)

        for key, data in results:
            self.currentEventCache[key] = data
