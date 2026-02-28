from typing import TypeVar, Type, Callable, Generic 
from api.client import client 
from dataclasses import dataclass
from utils.dataclasses import (
    NkData,
    Body,
    EventURLs
)
from utils.helperFunctions import transformDataToDataClass
from utils.dataclasses import URLS 
from config import BOTID, BOTTOKEN 

T = TypeVar("T")
K = TypeVar("K")

@dataclass(frozen=True)
class PreviousEvent:
    name: str 
    id: str
    start: int 
    end: int

@dataclass(frozen=True)
class MainContext:
    previousEvents: list[PreviousEvent]
    metaDataURL: str | None
    selectedID: Body 

@dataclass(frozen=True)
class ProfileContext(Generic[T, K]):
    mainData: MainContext
    metaData: T 
    secondaryData: K | None  
    emojiData: dict[str, str]
    difficulty: str 
    id: str 


class EventContext:

    _emojiCache = {}

    def __init__(self, urls: EventURLs, id: str, isLeaderboard: bool):

        self._urls = urls   
        self._id = id 
        self._isLeaderboard = isLeaderboard


    async def _getMainApiContext(self, difficulty: str) -> MainContext:
        
        mainApiData = await client.fetch(url=self._urls.base)
        mainPage = transformDataToDataClass(NkData, mainApiData)

        if not mainPage.success:
            raise ValueError()

        allEvents = mainPage.body
        selectedID = next((event for event in allEvents if event.id == self._id), None)
        
        if self._isLeaderboard:
            totalScoresKey = self._urls.totalScores.format(difficulty.lower())
            selectedID = self._getCurrentActiveLeaderboard(allEvents, totalScoresKey)
    
        return MainContext(
            previousEvents = [
                PreviousEvent(
                    name = event.name,
                    id = event.id,
                    start = event.start,
                    end = event.end 
                ) 
                for event in allEvents if event
            ],
            metaDataURL = self._urls.getExtensionAttribute(selectedID, difficulty.lower()), 
            selectedID = selectedID
        )


    def _getCurrentActiveLeaderboard(self, allEvents: list[Body], totalScoresKey: str) -> Body | None:
        
        for currentEntry in allEvents: 
            value = getattr(currentEntry, totalScoresKey) 
            if value != 0:
                return currentEntry

        return

    async def _getSubApiContext(
            self,          
            metaData: T, 
            subResourceObject: Type[K],
            subURLResolver: Callable[[T], str]
    ) -> K | None:
        
        if callable(subURLResolver):
            targetURL = subURLResolver(metaData)
    
        if targetURL and subResourceObject:
            subApiData = await client.fetch(url = targetURL)
            subData = transformDataToDataClass(subResourceObject, subApiData)

        else:
            return 

        return subData

        
    async def _testForEmojis(self) -> None:

        if self._emojiCache:
            return 
            
        emojiURL = URLS["Emojis"].base.format(BOTID)

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }
            
        emojiAPIData = await client.fetch(url = emojiURL, headers = headers)
        itemData = emojiAPIData.get("items", None)

        self._emojiCache = {emoji["name"]: emoji["id"] for emoji in itemData}


    async def buildEventContext(
            self, 
            difficulty: str, 
            metaDataObject: Type[T], 
            subResourceObject: Type[K] | None = None,
            subURLResolver: Callable[[T], str] | None = None 
        ) -> ProfileContext[T, K]:

        subData = None

        mainData = await self._getMainApiContext(difficulty)

        metaAPIData = await client.fetch(url=mainData.metaDataURL if mainData.metaDataURL else "")
        metaData = transformDataToDataClass(metaDataObject, metaAPIData)
         
        if callable(subURLResolver) and subResourceObject:
            subData = await self._getSubApiContext(metaData, subResourceObject, subURLResolver)


        await self._testForEmojis()

        return ProfileContext[T, K](
            mainData = mainData, 
            metaData = metaData,
            secondaryData = subData,
            emojiData = self._emojiCache,
            difficulty = difficulty,
            id = self._id
        )
