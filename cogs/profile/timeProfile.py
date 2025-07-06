from timeCalculator.send import TimeSend 
from timeCalculator.ct import TimeCT 
from timeCalculator.goal import TimeGoal 
from cogs.baseCommand import BaseCommand
from utils.assets.eventUrls import EVENTURLS

def timeProfile(**components):

    classesForCommand = {
        "send": TimeSend, 
        "ct": TimeCT,
        "goal": TimeGoal 
    }

    commandName = components.get("CommandName", None) 
    currentCommand = classesForCommand[commandName](**components)
    timeData, title = currentCommand.formatTime() 

    return BaseCommand.createEmbed(timeData, EVENTURLS["Race"]["race"], title)
