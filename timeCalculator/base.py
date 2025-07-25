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
    def calculateSendingTime(longestRound: int, startRound: int, longestRoundInSeconds: float, extraTime: float = 0) -> float:
        
        offRound = 0 if startRound == 1 else 1
        
        return (
            (longestRound - startRound - offRound) * 0.2 
            + (math.ceil(longestRoundInSeconds * 60) + 1)
            / 60 
            + extraTime 
        )

    @staticmethod 
    def msToTimeString(seconds: float) -> str: 

        totalHundredths = int(seconds * 100)
        minutes = totalHundredths // 6000
        seconds = (totalHundredths % 6000) // 100
        hundredths = totalHundredths % 100

        if hundredths % 10 in [2, 4, 7, 9]:
            hundredths -= 1

        return f"{minutes}:{seconds:02}.{hundredths:02}"

    @staticmethod
    def getEmotes() -> dict:
        return BaseCommand.getAllEmojis()
