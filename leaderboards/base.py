from datetime import timezone, datetime 
from utils.dataclasses.main import Body
from cogs.baseCommand import BaseCommand 

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
        return BaseCommand.useApiCall(f"{metaData}?page={page}")

    @staticmethod
    def getMedalForPosition(emojis: dict, currentPosition: int, totalScores: int, mode: dict) -> str: 
        percentilePosition = currentPosition / totalScores 

        for (start, end), medal in mode.items():
            if isinstance(start, int) and start <= currentPosition <= end:
                return f"<:{medal}:{emojis.get(medal)}>" 
            elif isinstance(start, float) and start <= percentilePosition <= end:
                return f"<:{medal}:{emojis.get(medal)}>"
        return ""

    @staticmethod
    def timeLeftForLeaderboard(eventEnd: int) -> int | str: 
        currentTimeStamp = int(datetime.now(timezone.utc).timestamp() * 1000)
        timeLeftInMs = eventEnd - currentTimeStamp 
        return BaseLeaderboard.convertMsToTime(timeLeftInMs) if timeLeftInMs > 0 else "Event ended"

    @staticmethod  
    def formatEventInfo(apiData: Body, lbType: str, difficulty: str) -> str:
    
        match lbType:
            case "race":
                eventTimeStamp = apiData.start 
                eventNumber = BaseCommand.getCurrentEventNumber(eventTimeStamp, "race")
                eventName = apiData.name
                title = f"Race #{eventNumber} - {eventName}"  

            case "boss":
                eventNumber = BaseCommand.splitBossNames(apiData.name)
                eventName = apiData.bossType
                scoreTypeKey = "eliteScoringType" if difficulty.lower() == "elite" else "normalScoringType" 
                title = f"{difficulty.title()} {eventNumber} - {getattr(apiData, scoreTypeKey)}"

            case "ct":
                currentIndex = apiData.start 
                eventNumber = BaseCommand.getCurrentEventNumber(currentIndex, "ct")
                title = f"Contested Territory #{eventNumber} - {difficulty.title()}"

            case _:
                return ""

        return title
