from timeCalculator.send import TimeSend 
from timeCalculator.ct import TimeCT 
from timeCalculator.goal import TimeGoal 

def timeProfile(**components):

    classesForCommand = {
        "send": TimeSend, 
        "ct": TimeCT,
        "goal": TimeGoal 
    }

    commandName = components.get("CommandName", None) 
    print(classesForCommand[commandName](**components))
