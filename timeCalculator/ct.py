import math 
from timeCalculator.base import TimeBase 

class TimeCT(TimeBase):
    def __init__(self, **components):
    
        self.startRound = components.get("StartRound", None)
        self.endRound = components.get("EndRound", None)
        self.goalTime = components.get("GoalTime", None)
        self.currentTime = components.get("CurrentTime", None)
    
    def formatTime(self):
        
        timeInSeconds = TimeBase.parseTime(self.goalTime)
        tileTimeInSeconds = TimeBase.parseTime(self.currentTime)

        raceRounds = TimeBase.getRaceRounds(isAbr=False) #ABR doesnt exist in CT 
        emotes = TimeBase.getEmotes() 
        roundIcon = emotes.get("Round", None)
        
        longestRoundInSeconds = max(raceRounds[self.startRound:self.endRound + 1])
        longestRoundIndex = raceRounds.index(longestRoundInSeconds) 
 
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

     #   self.getLaterRounds(raceRounds, eventData, longestRoundIndex, sendingTime, self.endRound)

        title = "CT Reverse Time Calculator"

        return eventData, title   
