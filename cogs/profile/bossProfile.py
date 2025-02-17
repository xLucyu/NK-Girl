from cogs.basecommand import baseCommand
from utils.filter.embedfilter import filterembed
from utils.assets.urls import EVENTURLS
import re

def bossnumber(BossName):
    
    number = "".join([n for n in BossName if n.isdigit()])
    name = "".join([l for l in BossName if not l.isdigit()])
    return f"{name} #{number}"


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

    name = re.sub(r'\d+', '', api.get("Name"))
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name]

    eventData = { 
        f"{difficulty.title()} Difficulty": [f"{stats.get('Map')}, {stats.get('Difficulty')} - {stats.get('Mode')}", False],
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
 
    
    eventNumber = bossnumber(api.get("Name"))
    embed = filterembed(eventData, eventURL, title=f"{eventNumber}")
    names = list()

    for name in api.get("Names"):
        names.append(bossnumber(name))

    return embed, names
