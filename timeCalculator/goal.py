from timeCalculator.base import TimeBase
import math

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

        if not 1 <= self.startRound <= 139:
            raise ValueError("StartRoundOutOfBounce")

        if not 2 <= self.endRound <= 140:
            raise ValueError("EndRoundOutOfBounce")

        if longestRoundInSeconds > timeInSeconds:
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
        raceRounds = TimeBase.getRaceRounds(self.isAbr)
        emotes = TimeBase.getEmotes()

        offRound = 0 if self.startRound == 1 else 1
        roundIcon = emotes.get("Round", None)

        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds)
        longestRoundDelay = (longestRoundIndex - self.startRound - offRound) * 0.2
 
        self.validateInput(timeInSeconds, longestRoundInSeconds + longestRoundDelay)

        sendingTime = TimeBase.calculateSendingTime(longestRoundIndex, self.startRound, longestRoundInSeconds)        
        goalTime = timeInSeconds - sendingTime
 
        formattedTime = TimeBase.msToTimeString(goalTime) 
        formattedInputTime = TimeBase.msToTimeString(timeInSeconds)

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

        self.getLaterRounds(raceRounds, eventData, longestRoundIndex, timeInSeconds, self.endRound)
        
        title = "Goal Time Calculator"
        return eventData, title
