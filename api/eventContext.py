from api.client import client 
from dataclasses import dataclass, field
from utils.dataclasses import (
    NkData,
    MetaData, 
    EventURLs,
    Body
)
from utils.helperFunctions import transformDataToDataClass
from utils.dataclasses import URLS 
from config import BOTID, BOTTOKEN 

@dataclass
class PreviousEvent:
    name: str 
    id: str

@dataclass(frozen=True)
class MainContext:
    previousEvents: list[PreviousEvent] = field(default_factory=list[PreviousEvent])
    metaDataURL: str = "" 
    selectedID: Body = None

@dataclass(slots=True)
class ProfileContext:
    mainData: MainContext
    metaData: MetaData
    emojiData: dict[str, str]
    difficulty: str 
    id: str 


class EventContext:

    _emojiCache = {}

    def __init__(self, urls: EventURLs, id: str, difficulty: str, isLeaderboard: bool):

        self._urls = urls 
        self._id = id
        self._difficulty = difficulty
        self._isLeaderboard = isLeaderboard 

    async def _getMainApiContext(self) -> MainContext:
        
        mainApiData = await client.fetch(url=self._urls.base)
        mainPage = transformDataToDataClass(NkData, mainApiData)

        if not mainPage.success:
            raise ValueError()

        allEvents = mainPage.body
        selectedID = next(event for event in allEvents if event.id == self._id)
        
        if self._isLeaderboard:
            totalScoresKey = self._urls.totalScores.format(self._difficulty.lower() if self._difficulty else "")
            selectedID = self._getCurrentActiveLeaderboard(allEvents, totalScoresKey)
    
        return MainContext(
            previousEvents = [
                PreviousEvent(
                    name = event.name,
                    id = event.id 
                ) 
                for event in allEvents if event
            ],
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
            subURLResolver: Callable[[MainContext, T], str] | None = None 
        ) -> ProfileContext[T, K]:

        mainData = await self._getMainApiContext()

        metaAPIData = await client.fetch(url=mainData.metaDataURL if mainData.metaDataURL else "")
        metaData = transformDataToDataClass(MetaData, metaAPIData)
          
        await self._testForEmojis()

        return ProfileContext(
            mainData = mainData, 
            metaData = metaData, 
            emojiData = self._emojiCache,
            difficulty = self._difficulty,
            id = self._id
        )
