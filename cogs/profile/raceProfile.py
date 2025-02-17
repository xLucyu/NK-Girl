from cogs.basecommand import baseCommand
from utils.filter.embedfilter import filterembed 
from utils.assets.urls import EVENTURLS
import math

def currenteventnumber(startTimeStamp):
    
    firstTimeStamp = 1544601600000
    timeDifference = startTimeStamp - firstTimeStamp
    current_Number = math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000))
    return round(current_Number)

def raceProfile(index, difficulty=None):

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/races",
        "extensions": "metadata"
    }

    NKDATA = baseCommand(urls, index)

    if not NKDATA:
        return 
    
    api = NKDATA.get("Api") 
    stats = NKDATA.get("Stats") 
    modifiers = NKDATA.get("Modifiers")
    towers = NKDATA.get("Towers")
    eventURL = EVENTURLS["Race"]["race"]
    
    if not stats or not towers or not api:
        return 

    eventData = { 
        api.get("Name"): [f"{stats.get('Map')}, {stats.get('Difficulty')} - {stats.get('Mode')}", False],
        "Modifiers": ["\n".join(modifiers), False], #type: ignore
        "Lives": [f"<:Lives:1337794403019915284> {stats.get('Lives')}", True],
        "Cash": [f"<:cash:1338140224353603635> ${stats.get('Cash'):,}", True],
        "Rounds": [f"{stats.get('StartRound')}/{stats.get('EndRound')}", True],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        } 
    
    currentTimeStamp = api.get("TimeStamp", None) #type: ignore
    eventNumber = currenteventnumber(currentTimeStamp)
    embed = filterembed(eventData, eventURL, title=f"Race #{eventNumber}")
    names = api.get("Names", None)

    return embed, names

