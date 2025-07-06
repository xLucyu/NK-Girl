from timeCalculator.base import TimeBase 

class TimeGoal(TimeBase):
    def __init__(self, **components):

        self.goalTime = components.get("GoalTime")
        self.startRound = components.get("StartRound")
        self.endRound = components.get("Endround")
