from datetime import timezone, datetime 
from utils.dataclasses.main import Body

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
    def formatEventInfo(mainData: Body, lbType: str, difficulty: str) -> str:
        
        match lbType:
            case "Race":
                eventTimeStamp = mainData.start 
                eventNumber = BaseCommand.getCurrentEventNumber(eventTimeStamp, "race")
                eventName = mainData.name
                title = f"Race #{eventNumber} - {eventName}"  

            case "Boss":
                eventNumber = BaseCommand.splitBossNames(mainData.name)
                eventName = mainData.bossType
                scoreTypeKey = mainData.eliteScoringType if difficulty == "elite" else mainData.normalScoringType 
                title = f"{difficulty.title()} {eventNumber} - {scoreTypeKey}"

            case "CT":
                currentIndex = mainData.start 
                eventNumber = BaseCommand.getCurrentEventNumber(currentIndex, "ct")
                title = f"Contested Territory #{eventNumber} - {difficulty.title()}"

            case _:
                return ""

        return title
