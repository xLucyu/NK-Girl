from cogs.basecommand import baseCommand
from cogs.eventNumber import currentEventNumber
from cogs.regex import *
from utils.filter.filteredmodifiers import filtermodifiers
from utils.filter.embedfilter import filterembed
from utils.assets.urls import EVENTURLS
from api.metadata import getMetaData

def validateTitle(stats: dict, difficulty: str) -> str:

    if stats["Extreme"]:
        title = f"Difficulty: {difficulty.title()}, Extreme"
    else:
        title = f"Difficulty: {difficulty.title()}"
 
    return title


def filtermaps(maps: dict, eventData: dict, emotes: dict) -> None:
    

    for index in range(len(maps)):
        
        map = maps[index]

        mapList = getMetaData(map)
        modifiers = filtermodifiers(mapList.get("Modifiers"), emotes) #type: ignore
        mode = splitUppercase(map.get("mode"))

        difficulty = splitUppercase(map.get("difficulty"))
        mapName = splitUppercase(map.get("map"))
        title = f"{index+1}. {mapName} ({difficulty}, {mode})"
        cash = f"<:Cash:{emotes.get('Cash')}> ${map.get('startingCash'):,}"
        round = f"<:Round:{emotes.get('Round')}> {map.get('startRound')}/{map.get('endRound')}"

        value = [f"{cash}, {round}\n{', '.join(modifiers)}", False] 
        eventData[title] = value


def odysseyProfile(index: int, difficulty: str):

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/odyssey",
        "extension": f"metadata_{difficulty}"
    }

    NKDATA = baseCommand(urls, index)
    
    if not NKDATA:
        return 
    
    api = NKDATA.get("Api", None) 
    stats = NKDATA["Stats"]["Odyssey"]  
    towers = NKDATA.get("Towers", None)
    emotes = NKDATA.get("Emotes", None)
    maps = NKDATA.get("Maps", None)
    eventURL = EVENTURLS["Odyssey"][difficulty]

    title = (
        f"{validateTitle(stats, difficulty)}\n"
        f"Lives: <:Lives:{emotes.get('Lives')}> {stats.get('StartHealth')}\n"
        f"Max Seats: {stats.get('MaxTowers')}\n"
        f"Max Monkeys: {stats.get('MaxSlots')}"
    )

    eventData = {
        api.get("Name"): [title, False],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        }

    filtermaps(maps, eventData, emotes) #add the maps data -> each difficulty has a set amount of maps
    currentTimeStamp = api.get("TimeStamp", None)
    firstTimeStamp = 1593532800000
    eventNumber = currentEventNumber(currentTimeStamp, firstTimeStamp)
    embed = filterembed(eventData, eventURL, title=f"Odyssey #{eventNumber}")
    names = api.get("Names", None)

    return embed, names
