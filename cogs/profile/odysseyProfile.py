from cogs.basecommand import baseCommand
from utils.filter.filteredmodifiers import filtermodifiers
from utils.filter.embedfilter import filterembed
from utils.assets.urls import EVENTURLS
from api.metadata import getMetaData
import math, re

def validateTitle(stats, difficulty):

    if stats["Extreme"]:
        title = f"Difficulty: {difficulty.title()}, Extreme"
    else:
        title = f"Difficulty: {difficulty.title()}"
 
    return title

def currenteventnumber(startTimeStamp):
    
    firstTimeStamp = 1593532800000
    timeDifference = startTimeStamp - firstTimeStamp
    current_Number = math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000))
    return round(current_Number)


def filtermaps(maps: dict, eventData: dict, emotes: list) -> None:
    

    for index in range(len(maps)):
        
        map = maps[index]

        mapList = getMetaData(map)
        modifiers = filtermodifiers(mapList.get("Modifiers"), emotes) #type: ignore
        
        mode = re.findall(r'[A-Z][a-z]*', map.get("mode"))
        mapName = re.findall(r'[A-Z][a-z]*', map.get("map"))

        title = f"{index+1}. {' '.join(mapName)} ({map.get('difficulty')}, {' '.join(mode)})"
        value = [f"<:cash:1338140224353603635> ${map.get('startingCash'):,}, round {map.get('startRound')}/{map.get('endRound')}\n{', '.join(modifiers)}", False]
        
        eventData[title] = value


def odysseyProfile(index, difficulty):

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/odyssey",
        "extensions": difficulty
    }

    NKDATA = baseCommand(urls, index)
    
    if not NKDATA:
        return 
    
    api = NKDATA.get("Api") 
    stats = NKDATA["Stats"]["Odyssey"]  
    towers = NKDATA.get("Towers")
    emotes = NKDATA.get("Emotes")
    maps = NKDATA.get("Maps")
    eventURL = EVENTURLS["Odyssey"][difficulty]
    
    if not stats or not towers or not api or not emotes or not maps:
        return  

    title = (
        f"{validateTitle(stats, difficulty)}\n"
        f"Lives: <:Lives:1337794403019915284> {stats.get('StartHealth')}\n"
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
    eventNumber = currenteventnumber(currentTimeStamp)
    embed = filterembed(eventData, eventURL, title=f"Odyssey #{eventNumber}")
    names = api.get("Names", None)

    return embed, names
