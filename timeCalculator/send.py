from timeCalculator.base import TimeBase 

class TimeSend(TimeBase):
    def __init__(self, **components):
        
        self.time = components.get("Time", None)
        self.startRound = components.get("StartRound", None)
        self.endRound = components.get("EndRound", None)
        self.isAbr = components.get("ABR", None)

    def formatTime(self) -> tuple[dict, str]:

        timeInMs = TimeBase.parseTime(self.time)
        raceRounds = TimeBase.getRaceRounds(self.isAbr)
        emotes = TimeBase.getEmotes() 

        roundIcon = emotes.get("Round", None)
        
        longestRoundInMs = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInMs)

        sendingTime = timeInMs + longestRoundInMs + 200.01 * (longestRoundIndex - self.startRound)
        formattedTime = TimeBase.msToTimeString(sendingTime)
        formattedInputTime = TimeBase.msToTimeString(timeInMs)

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Sending Time": [formattedInputTime, False],
            "Calculated Data": [f"You will get {formattedTime} if you perfectly clean round {longestRoundIndex}.", False]
        } 

        title = "Race Time Calculator"

        return eventData, title
