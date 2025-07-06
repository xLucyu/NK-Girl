from timeCalculator.base import TimeBase 

class TimeSend(TimeBase):
    def __init__(self, **components):
        
        self.time = components.get("Time")
        self.startRound = components.get("StartRound")
        self.endRound = components.get("EndRound")
