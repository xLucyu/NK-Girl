from timeCalculator.send import TimeSend  
from timeCalculator.goal import TimeGoal 

def timeProfile(**components):

    classesForCommand = {
        "send": TimeSend, 
        "goal": TimeGoal 
    }

    commandName = components.get("CommandName", None) 
    currentCommand = classesForCommand[commandName](**components)
    timeData, title = currentCommand.formatTime() 

    embed = BaseCommand.createEmbed(timeData, EVENTURLS["Race"]["race"], title)
    embed.set_footer(text = "*Times ending on: 2, 4, 7 or 9 will be reduced by 1 frame.")
    return embed
