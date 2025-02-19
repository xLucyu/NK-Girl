from cogs.basecommand import baseCommand
from cogs.regex import *
from utils.filter.embedfilter import filterembed
from utils.assets.urls import EVENTURLS

def bossProfile(index, difficulty):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extensions": f"metadata/{difficulty}"
    }

    NKDATA = baseCommand(urls, index)
    
    if not NKDATA:
        return 
    
    api = NKDATA.get("Api") 
    stats = NKDATA.get("Stats")
    emotes = NKDATA.get("Emotes")
    modifiers = NKDATA.get("Modifiers")
    towers = NKDATA.get("Towers")

    if not api or not stats or not emotes or not modifiers or not towers:
        return

    name = removeNumbers(api.get("Name"))
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name]
    map = splitUppercase(stats.get("Map")) 
    modeDifficulty = splitUppercase(stats.get("Difficulty"))
    mode = splitUppercase(stats.get("Mode")) 

    if difficulty == "standard":
        difficulty = "normal"

    eventData = { 
        f"{difficulty.title()} Difficulty": [f"{map}, {modeDifficulty} - {mode}", False],
        "Modifiers": ["\n".join(modifiers), False],
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
 
    
    eventNumber = splitNumbers(api.get("Name"))
    embed = filterembed(eventData, eventURL, title=f"{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][map])
    names = list()

    for name in api.get("Names"):
        names.append(splitNumbers(name))

    return embed, names
