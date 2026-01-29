import aiohttp
from utils.dataclasses.main import NkData, Body

from typing import TYPE_CHECKING 
if TYPE_CHECKING:
    from cogs.baseCommand import BaseCommand

class ApiWrapper:

    def __init__(self, baseURL: str):

        self._baseURL = baseURL
        self._endPoint = ""
        self._headers = {}
        self._session: aiohttp.ClientSession | None = None


    async def initializeSession(self):

        self._session = aiohttp.ClientSession()
        return
    

    async def closeSession(self) -> None:

        await self._session.close()


    def setEndpoint(self, endpoint: str):

        self._endPoint = endpoint
        return 
    
    
    def setHeaders(self, headers: dict):

        self._headers = headers 
        return
    

    async def getData(self) -> dict:

        async with self._session.get(
            f"{self._baseURL}/{self._endPoint}",
            headers=self._headers
        ) as response:
            
            match response.status:

                case 200:
                    return await response.json()
                
                case 400 | 403 | 404:
                    raise ValueError("RequestNoSuccess")
                
                case 500 | 502 | 503 | 504:
                    raise ValueError("ServerDown")
                
                case _:
                    raise ValueError()
                    

    def getCurrentActiveLeaderboard(self, data: NkData, urls: dict) -> int | None:

        leaderboardKey = urls.get("TotalScores")

        for index, _ in enumerate(data.body):
            if leaderboardKey > 0:
                return index 
            
        return
         

    async def getID(self, index: int) -> dict[list, Body]:

        eventData = await self.getData()

        mainData = BaseCommand.transformDataToDataClass(NkData, eventData)
        selectedID = mainData.body[index]

        return {
            "PreviousEvents": [entry.name for entry in mainData.body if entry], 
            "Data": selectedID
        } 
