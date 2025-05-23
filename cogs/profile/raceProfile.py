from cogs.baseCommand import baseCommand
from cogs.eventNumber import currentEventNumber
from cogs.regex import splitUppercase
from utils.filter.createEmbed import filterembed 
from utils.assets.eventUrls import EVENTURLS 

def raceProfile(index, difficulty):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/races",
        "extension": "metadata"
    }

    NKDATA = baseCommand(urls, index)    

    if not NKDATA:
        return 
    
    api = NKDATA.get("Api", None)
    apiData = api.get("Data", None)
    stats = NKDATA.get("Stats", None)
    emotes = NKDATA.get("Emotes", None)
    modifiers = NKDATA.get("Modifiers", None)
    towers = NKDATA.get("Towers", None)
    eventURL = EVENTURLS["Race"]["race"] 
     
    map = splitUppercase(stats.get("Map"))
    difficulty = splitUppercase(stats.get("Difficulty"))
    mode = splitUppercase(stats.get("Mode"))

    lives = f"<:Lives:{emotes.get('Lives')}> {stats.get('Lives')}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${stats.get('Cash'):,}"
    rounds = f"<:Round:{emotes.get('Round')}> {stats.get('StartRound')}/{stats.get('EndRound')}"

    eventData = { 
        apiData.get("name"): [f"{map}, {difficulty} - {mode}", False],
        "Modifiers": ["\n".join(modifiers), False], 
        "Lives": [lives, True],
        "Cash": [cash, True],
        "Rounds": [rounds, True],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        } 
    
    currentTimeStamp = apiData.get("start") 
    firstTimeStamp = 1544601600000
    eventNumber = currentEventNumber(currentTimeStamp, firstTimeStamp)
    embed = filterembed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][map])
    names = api.get("Names", None) 

    return embed, names
