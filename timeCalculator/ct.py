from timeCalculator.base import TimeBase 

class TimeCT(TimeBase):
    def __init__(self, **components):

        self.goalTime = components.get("GoalTime")
        self.currentTime = components.get("CurrentTime")
        self.endRound = components.get("EndRound")
    
    def formatTime(self):
        pass


