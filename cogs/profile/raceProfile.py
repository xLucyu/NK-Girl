from cogs.basecommand import baseCommand
from cogs.eventNumber import currentEventNumber
from cogs.regex import splitUppercase
from utils.filter.embedfilter import filterembed 
from utils.assets.urls import EVENTURLS


def raceProfile(index, difficulty):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/races",
        "extension": "metadata"
    }

    NKDATA = baseCommand(urls, index)    

    if not NKDATA:
        return 
    
    api = NKDATA.get("Api", None) 
    stats = NKDATA.get("Stats", None) 
    modifiers = NKDATA.get("Modifiers", None)
    towers = NKDATA.get("Towers", None)
    eventURL = EVENTURLS["Race"]["race"] 
     

    map = splitUppercase(stats.get("Map"))
    difficulty = splitUppercase(stats.get("Difficulty"))
    mode = splitUppercase(stats.get("Mode")) 

    eventData = { 
        api.get("Name"): [f"{map}, {difficulty} - {mode}", False],
        "Modifiers": ["\n".join(modifiers), False], 
        "Lives": [f"<:Lives:1337794403019915284> {stats.get('Lives')}", True],
        "Cash": [f"<:cash:1338140224353603635> ${stats.get('Cash'):,}", True],
        "Rounds": [f"<:Round:1342535466855038976> {stats.get('StartRound')}/{stats.get('EndRound')}", True],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        } 
    
    currentTimeStamp = api.get("TimeStamp") 
    firstTimeStamp = 1544601600000
    eventNumber = currentEventNumber(currentTimeStamp, firstTimeStamp)
    embed = filterembed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][map])
    names = api.get("Names", None) 

    return embed, names

