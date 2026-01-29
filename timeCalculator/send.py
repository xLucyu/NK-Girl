from timeCalculator.base import TimeBase 

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
        if not 0 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 1 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")


    def formatTime(self) -> tuple[dict, str]:

        timeInSeconds = self.parseTime(self.time)
        self.validateInput(timeInSeconds)

        raceRounds = self.getRaceRounds(self.isAbr)
        emotes = self.getEmotes()

        roundIcon = emotes.get("Round", None)
        
        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)

        sendTime = self.calculateSendingTime(longestRoundIndex, self.startRound, longestRoundInSeconds, timeInSeconds)

        formattedTime = self.msToTimeString(sendTime) 
        formattedInputTime = self.msToTimeString(timeInSeconds) 

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Sending Time": [f"**{formattedInputTime}**", False],
            "Calculated Time": [f"You will get **{formattedTime}** if you perfectly clean round **{longestRoundIndex}**.\n", False]
        }  

        self.getLaterRounds(raceRounds, longestRoundIndex, sendTime, self.endRound, eventData)

        title = "Race Time Calculator"

        return eventData, title
