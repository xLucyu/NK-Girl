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

        # to do: add later rounds that are shorter than the last round + add last round 

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Sending Time": [formattedInputTime, False],
            "Calculated Time": [f"You will get **{formattedTime}** if you perfectly clean round **{longestRoundIndex}**.", False]
        } 

        title = "Race Time Calculator"

        return eventData, title
