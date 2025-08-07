from timeCalculator.base import TimeBase 

class TimeCT(TimeBase):
    def __init__(self, **components):
    
        self.startRound = components.get("StartRound", None)
        self.endRound = components.get("EndRound", None)
        self.goalTime = components.get("GoalTime", None)
        self.currentTime = components.get("CurrentTime", None)

    def validateInput(self, timeInSeconds: float, tileTimeInSeconds: float):

        if timeInSeconds < 0.0:
            raise ValueError("InvalidTimeFormat")

        if self.startRound >= self.endRound:
            raise ValueError("InvalidStartRound")

        if not 1 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 2 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")

        if tileTimeInSeconds < timeInSeconds:
            raise ValueError("GoalTimeTooLow")

    def getLaterRounds(self, raceRounds: list, eventData: dict, longestRoundIndex: int, goalTime: float, endRound: int) -> None:
        
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
            sendingTime = goalTime - rawLength - delay  

            currentRound = nextLongestRound

            eventData["Calculated Time"][0] += (f"\nSend Round **{currentRound}** before **{TimeBase.msToTimeString(sendingTime)}**")
 
    
    def formatTime(self):
        
        timeInSeconds = TimeBase.parseTime(self.goalTime)
        tileTimeInSeconds = TimeBase.parseTime(self.currentTime)

        raceRounds = TimeBase.getRaceRounds(isAbr=False) #ABR doesnt exist in CT 
        emotes = TimeBase.getEmotes() 
        roundIcon = emotes.get("Round", None)
        
        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)

        self.validateInput(timeInSeconds, tileTimeInSeconds)
 
      #  self.validateInput(timeInSeconds, longestRoundInSeconds + longestRoundDelay)
        sendingTime = TimeBase.calculateSendingTime(longestRoundIndex, self.startRound, longestRoundInSeconds, tileTimeInSeconds)
        goalTime = sendingTime - timeInSeconds
        
        formattedTime = TimeBase.msToTimeString(goalTime) 
        formattedInputTime = TimeBase.msToTimeString(timeInSeconds)
        currentFormattedTime = TimeBase.msToTimeString(tileTimeInSeconds)

        eventData = {
            "Rounds": [f"<:Round:{roundIcon}> {self.startRound} -> {self.endRound}", False],
            "Longest Round": [f"<:Round:{roundIcon}> {longestRoundIndex}", False],
            "Current Time on Tile": [f"**{currentFormattedTime}**", False], 
            "Calculated Time": [f"To get **{formattedInputTime}** you need to send round **{longestRoundIndex}** before **{formattedTime}**", False]
        } 
         
        self.getLaterRounds(raceRounds, eventData, longestRoundIndex, goalTime, self.endRound)

        title = "CT Reverse Time Calculator"

        return eventData, title   
