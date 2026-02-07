from api.client import client 
from dataclasses import dataclass 
from utils.dataclasses import (
    NkData,
    MetaData, 
    EventURLs,
    Body
)
from utils.helperFunctions import transformDataToDataClass
from config import BOTID, BOTTOKEN 


@dataclass(slots=True)
class MainContext:
    previousEvents: list[str]
    metaDataURL: str | None  
    selectedID: Body

@dataclass(slots=True)
class ProfileContext:
    mainData: MainContext
    metaData: MetaData
    emojiData: dict[str, str]
    difficulty: str 
    index: int 


class EventContext:

    _emojiCache = {}

    def __init__(self, urls: EventURLs, index: int, difficulty: str, isLeaderboard: bool):

        self._urls = urls 
        self._index = index
        self._difficulty = difficulty
        self._isLeaderboard = isLeaderboard 

    async def _getMainApiContext(self) -> MainContext:
        
        mainApiData = await client.fetch(url=self._urls.base)

        mainPage = transformDataToDataClass(NkData, mainApiData)

        allEvents = mainPage.body
        selectedID = allEvents[self._index]
        
        if self._isLeaderboard:
            totalScoresKey = self._urls.totalScores.format(self._difficulty.lower() if self._difficulty else "")
            selectedID = self._getCurrentActiveLeaderboard(allEvents, totalScoresKey)
    
        return MainContext(
            previousEvents = [event.name for event in allEvents if event],
            metaDataURL = self._urls.getExtensionAttribute(selectedID, self._difficulty), 
            selectedID = selectedID
        )


    def _getCurrentActiveLeaderboard(self, allEvents: list[Body], totalScoresKey: str) -> Body | None:
        
        for currentEntry in allEvents: 
            value = getattr(currentEntry, totalScoresKey) 
            if value != 0:
                return currentEntry

        return

    async def _testForEmojis(self) -> None:

        if self._emojiCache:
            return 
            
        emojiURL = f"https://discord.com/api/v10/applications/{BOTID}/emojis"

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }
            
        emojiAPIData = await client.fetch(url = emojiURL, headers = headers)
        itemData = emojiAPIData.get("items", None)

        self._emojiCache = {emoji["name"]: emoji["id"] for emoji in itemData}


    async def buildEventContext(self) -> ProfileContext:

        mainData = await self._getMainApiContext()

        metaAPIData = await client.fetch(url=mainData.metaDataURL if mainData.metaDataURL else "")
        metaData = transformDataToDataClass(MetaData, metaAPIData)
          
        await self._testForEmojis()

        return ProfileContext(
            mainData = mainData, 
            metaData = metaData, 
            emojiData = self._emojiCache,
            difficulty = self._difficulty,
            index = self._index
        )
