from dataclasses import dataclass 
from utils.dataclasses import (
    NkData,
    MetaData, 
    EventURLs
)
from utils.helperFunctions import transformDataToDataClass
from config import BOTID, BOTTOKEN
from .client import wrapper

@dataclass(slots=True)
class MainContext:
    previousEvents: list[str]
    metaDataURL: str | None  
    selectedID: dict

@dataclass(slots=True)
class ProfileContext:
    mainData: MainContext
    metaData: MetaData
    emojiData: dict[str, str]


class EventContext:

    _emojiCache = {}

    def __init__(self, urls: EventURLs, index: int, difficulty: str):

        self._urls = urls 
        self._index = index
        self._difficulty = difficulty

    async def _getMainApiContext(self) -> MainContext:
        
        mainApiData = await wrapper.get(url=self._urls.base)

        mainPage = transformDataToDataClass(NkData, mainApiData)

        allEvents = mainPage.body
        selectedID = allEvents[self._index]

        totalScoresKey = self._urls.totalScores

        if totalScoresKey:
            selectedID = self._getCurrentActiveLeaderboard(allEvents, totalScoresKey)

        return MainContext(
            previousEvents = [event.name for event in allEvents if event],
            metaDataURL = selectedID.get(self._urls.extension.format(self._difficulty)),
            selectedID = selectedID
        )


    def _getCurrentActiveLeaderboard(self, allEvents: list[dict], totalScoresKey: str) -> dict | None:

        for currentEntry in allEvents: 
            if currentEntry.get(totalScoresKey) != 0:
                return currentEntry 

        return

    async def _testForEmojis(self) -> None:

        if self._emojiCache:
            return 
            
        URL = f"https://discord.com/api/v10/applications/{BOTID}/emojis"

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }
            
        emojiAPIData = await wrapper.get(url = URL, headers = headers)
        itemData = emojiAPIData.get("items", None)

        self._emojiCache = {emoji["name"]: emoji["id"] for emoji in itemData}


    async def buildEventContext(self) -> ProfileContext:

        mainData = await self._getMainApiContext()
        
        metaAPIData = await wrapper.get(url=mainData.metaDataURL if mainData.metaDataURL else "")
        metaData = transformDataToDataClass(MetaData, metaAPIData)

        await self._testForEmojis()

        return ProfileContext(
            mainData = mainData, 
            metaData = metaData, 
            emojiData = self._emojiCache
        )
