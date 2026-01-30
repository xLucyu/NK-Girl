from aiohttp import ClientSession 

class ApiClient:
    
    def __init__(self, session: ClientSession):

        self._session: ClientSession = session
        self._url: str = "" 
        self._headers: dict = {} 

    def url(self, url: str):

        self._url = url 
        return self
    
    def headers(self, headers: dict[str, str]):

        self._headers = headers 
        return self 
    
    async def get(self) -> dict:

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

        self._session: ClientSession | None = None 

    async def start(self) -> None:

        if not self._session:
            self._session = ClientSession()

    async def stop(self) -> None:

        if self._session:
            await self._session.close()
            self._session = None

    def request(self) -> ApiClient:

        if not self._session:
            raise RuntimeError("Session not started")
        
        return ApiClient(self._session)
