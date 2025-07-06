import math 
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
    def msToTimeString(ms: float) -> str: 

        totalSeconds = ms / 1000
        minutes = int(totalSeconds // 60)
        seconds = int(totalSeconds % 60)
        hundredths = int(round((totalSeconds - minutes * 60 - seconds) * 100))

        if hundredths == 100:
            seconds += 1 

        return f"{minutes}:{seconds:02}.{hundredths:02}"

    @staticmethod
    def getEmotes() -> dict:
        return BaseCommand.getAllEmojis()
