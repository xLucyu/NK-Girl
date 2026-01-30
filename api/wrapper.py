import aiohttp 
from typing import Coroutine

class ApiClient:
    
    def __init__(self, session: aiohttp.ClientSession):

        self._session = session
        self._url = None 
        self._headers = None 

    def url(self, url: str):

        self._url = url 
        return self
    
    def headers(self, headers: dict):

        self._headers = headers 
        return self 
    
    async def get(self) -> Coroutine:

        async with self._session.get(
            url=self._url, 
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

class ApiWrapper:

    def __init__(self):
        self._session = aiohttp.ClientSession | None = None 

    async def start(self) -> None:

        if not self._session:
            self._session = aiohttp.ClientSession()

    async def stop(self) -> None:

        if self._session:
            self._session.close()

    def request(self) -> ApiClient:
        if not self._session:
            raise RuntimeError()
        
        return ApiClient(self._session)
