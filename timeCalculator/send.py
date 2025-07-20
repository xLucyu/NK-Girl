from timeCalculator.base import TimeBase 
import math 

class TimeSend(TimeBase):
    def __init__(self, **components):
        
        self.time = components.get("Time", None)
        self.startRound = components.get("StartRound", None)
        self.endRound = components.get("EndRound", None)
        self.isAbr = components.get("ABR", None)

    def validateInput(self, timeInSeconds: float) -> None:

        if timeInSeconds < 0.0:
            raise ValueError("InvalidTimeFormat")

        if self.startRound >= self.endRound:
            raise ValueError("InvalidStartRound")

        if not 1 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 2 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")

    def getLaterRounds(self, raceRounds: list, eventData: dict, longestRoundIndex: int, sendingTime: float) -> None:
        
        current = longestRoundIndex

        while current < self.endRound:
            startRound = current + 1 
            remaining = raceRounds[startRound:]

            if not remaining:
                break 
            
            effectiveTimes = [
                (r, round(raceRounds[r] + (r - startRound) * 0.2))
                for r in range(startRound, self.endRound + 1)
            ]
                
            longestRound, _ = max(effectiveTimes, key=lambda x: x[1]) 
            rawLength = raceRounds[longestRound]
            delay = (longestRound - startRound) * 0.2 
            safeSeconds = roundsendingTime - rawLength - delay 

            current = longestRound 

            eventData["Calculated Time"][0] += (f"\nSend Round **{current}** before **{TimeBase.msToTimeString(safeSeconds)}**")


    def formatTime(self) -> tuple[dict, str]:

        timeInSeconds = TimeBase.parseTime(self.time)
        self.validateInput(timeInSeconds)

        raceRounds = TimeBase.getRaceRounds(self.isAbr)
        emotes = TimeBase.getEmotes()
        offRound = 0 if self.startRound == 1 else 1

        roundIcon = emotes.get("Round", None)
        
        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)

        sendingTime = (longestRoundIndex - self.startRound - offRound) * 0.2 + (math.ceil(longestRoundInSeconds * 60) + 1) / 60 + timeInSeconds
        formattedTime = TimeBase.msToTimeString(sendingTime) 
        formattedInputTime = TimeBase.msToTimeString(timeInSeconds) 

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Sending Time": [formattedInputTime, False],
            "Calculated Time": [f"You will get **{formattedTime}** if you perfectly clean round **{longestRoundIndex}**.\n", False]
        } 

        self.getLaterRounds(raceRounds, eventData, longestRoundIndex, sendingTime)

        title = "Race Time Calculator"

        return eventData, title
