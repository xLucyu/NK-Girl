from timeCalculator.base import TimeBase

class TimeGoal(TimeBase):

    def __init__(self, **components):

        self.goalTime = components.get("GoalTime", None)
        self.startRound = components.get("StartRound", None)
        self.endRound = components.get("EndRound", None)
        self.isAbr = components.get("ABR", None)

    def validateInput(self, timeInSeconds: float, longestRoundInSeconds: float):

        if timeInSeconds < 0.0:
            raise ValueError("InvalidTimeFormat")

        if self.startRound >= self.endRound:
            raise ValueError("InvalidStartRound")

        if not 0 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 1 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")

        if longestRoundInSeconds > timeInSeconds:
            raise ValueError("GoalTimeTooLow")
    
    def formatTime(self):

        timeInSeconds = self.parseTime(self.goalTime)
        raceRounds = self.getRaceRounds(self.isAbr)
        emotes = self.getEmotes()
 
        roundIcon = emotes.get("Round", None)

        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)

        sendingTime = self.calculateSendingTime(longestRoundIndex, self.startRound, longestRoundInSeconds)        
        goalTime = timeInSeconds - sendingTime
 
        formattedTime = self.msToTimeString(goalTime) 
        formattedInputTime = self.msToTimeString(timeInSeconds)

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Goal Time": [f"**{formattedInputTime}**", False],
            "Calculated Time": [(
                f"To get **{formattedInputTime}** you have to send to round **{longestRoundIndex}** at **{formattedTime}**." 
                f"assuming you perfectly clean.\n"
            ), False]
        }

        self.getLaterRounds(raceRounds, longestRoundIndex, timeInSeconds, self.endRound, eventData)
        
        title = "Goal Time Calculator"
        return eventData, title
