from api.fetchId import getData
from utils.assets.medals import MEDALS

class BaseLeaderboard:
    
    @staticmethod
    def convertMsToTime(score: int) -> str:
         
        days = score // (1000 * 60 * 60 * 24)
        hours = (score // (1000 * 60 * 60)) % 24 
        minutes = (score // (1000 * 60)) % 60
        seconds = (score // 1000) % 60
        milliseconds = score % 1000

        return (f"{days}d:" if days > 0 else "") + (f"{hours}:" if hours > 0 else "") + f"{minutes:02}:{seconds:02}.{milliseconds:03}"   
    
    @staticmethod
    def getLeaderboardData(metaData: str, page: int) -> dict:
        return getData(f"{metaData}?page={page}")

    @staticmethod
    def getMedalforPosition(emojis: dict, currentPosition: int, totalScores: int, mode: dict) -> str:
          
        percentilePosition = currentPosition / totalScores

        for (start, end), medal in mode.items():  
            if type(start) == int and start >= currentPosition and end <= currentPosition:
                return f"<:{medal}:{emojis.get(medal)}>"  
            elif type(start) == float and start >= percentilePosition and end <= percentilePosition:
                return f"<:{medal}:{emojis.get(medal)}>"
