from cogs.baseCommand import BaseCommand
from utils.assets.raceRounds import REGULAR, ABR 

class TimeBase:
    
    @staticmethod 
    def parseTime(time: str) -> int:
        return BaseCommand.convertStrToMs(time)
    
    @staticmethod 
    def getRaceRounds(isAbr: bool) -> list:
        return ABR if isAbr else REGULAR

    @staticmethod 
    def msToTimeString(seconds: float) -> str: 

        totalHundredths = int(seconds * 100)
        minutes = totalHundredths // 6000
        seconds = (totalHundredths % 6000) // 100
        hundredths = totalHundredths % 100 

        return f"{minutes}:{seconds:02}.{hundredths:02}"

    @staticmethod
    def getEmotes() -> dict:
        return BaseCommand.getAllEmojis()
