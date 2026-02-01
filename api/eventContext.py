from dataclasses import dataclass 
from utils.dataclasses import NkData, MetaData
from cogs.commandBase import CommandBase
from config import BOTID, BOTTOKEN


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

@dataclass(slots=True)
class EmojiData:
    name: str 
    id: str 

class EventContext:

    _emojiCache = {}

    def __init__(self, urls: dict[str, str], index: int):

        self._urls = urls 
        self._index = index


    async def _getMainApiContext(self) -> MainContext:
        
        mainApiData = await CommandBase.useApiCall(self._urls["base"])
        mainPage = CommandBase.transformDataToDataClass(NkData, mainApiData)

        allEvents = mainPage.body
        selectedID = allEvents[self._index]

        totalScoresKey = self._urls.get("TotalScores", None)

        if totalScoresKey:
            selectedID = self._getCurrentActiveLeaderboard(allEvents, totalScoresKey)

        return MainContext(
            previousEvents = [event.name for event in allEvents if event],
            metaDataURL = selectedID.get(self._urls.get("extension", None)),
            selectedID = selectedID 
        )


    def _getCurrentActiveLeaderboard(self, allEvents: list[dict], totalScoresKey: str) -> dict | None:

        for currentEntry in allEvents: 
            if currentEntry.get(totalScoresKey) != 0:
                return currentEntry 

        return

    async def _testForEmojis(self) -> None:

        URL = f"https://discord.com/api/v10/applications/{BOTID}/emojis"

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }

        if not self._emojiCache:
            
            emojiAPIData = await CommandBase.useApiCall(URL, headers)
            itemData: EmojiData = emojiAPIData.get("items", None)

            self._emojiCache = {emoji.name: emoji.id for emoji in itemData}

        return 


    async def buildEventContext(self) -> ProfileContext:

        mainData = await self._getMainApiContext()
        
        metaAPIData = await CommandBase.useApiCall(url=mainData.metaDataURL if mainData.metaDataURL else "")
        metaData = CommandBase.transformDataToDataClass(MetaData, metaAPIData)

        await self._testForEmojis()

        return ProfileContext(
            mainData = mainData, 
            metaData = metaData, 
            emojiData = self._emojiCache
        )
