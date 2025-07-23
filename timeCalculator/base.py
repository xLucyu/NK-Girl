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

        if hundredths % 10 in [2, 4, 7, 9]:
            hundredths -= 1

        return f"{minutes}:{seconds:02}.{hundredths:02}"

    @staticmethod
    def getEmotes() -> dict:
        return BaseCommand.getAllEmojis()

    @staticmethod
    def getLaterRounds(raceRounds: list, eventData: dict, longestRoundIndex: int, sendingTime: float, endRound: int) -> None:
        
        currentRound = longestRoundIndex

        while currentRound < endRound:
            startRound = currentRound + 1
            remainingRounds = raceRounds[startRound:]

            if not remainingRounds:
                break
            
            futureRaceRounds = [
                (round, raceRounds[round] + (round - startRound) * 0.2)
                for round in range(startRound, endRound + 1)
            ] 

            nextLongestRound, _ = max(futureRaceRounds, key=lambda round: round[1])
            rawLength = raceRounds[nextLongestRound]
            timeToSend = sendingTime - rawLength - ((nextLongestRound - currentRound) * 0.2) 

            currentRound = nextLongestRound

            eventData["Calculated Time"][0] += (f"\nSend Round **{currentRound}** before **{TimeBase.msToTimeString(timeToSend)}**")
