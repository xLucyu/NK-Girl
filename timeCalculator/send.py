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
        if not 1 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 2 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")


    def getLaterRounds(self, raceRounds: list, eventData: dict, longestRoundIndex: int, sendingTime: float, endRound: int) -> None:
        
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
            delay = 0.2 * (nextLongestRound - currentRound)
            timeToSend = sendingTime - rawLength - delay  

            currentRound = nextLongestRound

            eventData["Calculated Time"][0] += (f"\nSend Round **{currentRound}** before **{TimeBase.msToTimeString(timeToSend)}**")


    def formatTime(self) -> tuple[dict, str]:

        timeInSeconds = TimeBase.parseTime(self.time)
        self.validateInput(timeInSeconds)

        raceRounds = TimeBase.getRaceRounds(self.isAbr)
        emotes = TimeBase.getEmotes()

        roundIcon = emotes.get("Round", None)
        
        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)

        sendTime = TimeBase.calculateSendingTime(longestRoundIndex, self.startRound, longestRoundInSeconds, timeInSeconds)

        formattedTime = TimeBase.msToTimeString(sendTime) 
        formattedInputTime = TimeBase.msToTimeString(timeInSeconds) 

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Round Set": ["ABR" if self.isAbr else "Regular", False],
            "Sending Time": [f"**{formattedInputTime}**", False],
            "Calculated Time": [f"You will get **{formattedTime}** if you perfectly clean round **{longestRoundIndex}**.\n", False]
        } 

        self.getLaterRounds(raceRounds, eventData, longestRoundIndex, sendTime, self.endRound)

        title = "Race Time Calculator"

        return eventData, title
