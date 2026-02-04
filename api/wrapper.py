from aiohttp import ClientSession 
from typing import Optional

class ApiWrapper:

    def __init__(self):
        self._session: Optional[ClientSession] = None 

    async def __aenter__(self):

        await self.start()
        return self
    
    async def __aexit__(self, exc_type, exc, tb):
        await self.stop()

    async def start(self) -> None:

        if not self._session:
            self._session = ClientSession()


    def _checkSession(self) -> ClientSession:

        if self._session is None:
            raise RuntimeError("No Valid API Session")

        return self._session

    async def stop(self) -> None:

        if self._session:
            await self._session.close()
            self._session = None

    async def get(self, url: str, headers: Optional[dict[str, str]] = None) -> dict:

        session = self._checkSession()

        async with session.get(url=url, headers=headers) as response:
            
            match response.status:

                case 200:
                    return await response.json()
                
                case 400 | 403 | 404:
                    raise ValueError("RequestNoSuccess")
                
                case 500 | 502 | 503 | 504:
                    raise ValueError("ServerDown")

                case _:
                    raise ValueError()
