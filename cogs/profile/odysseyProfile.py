from cogs.baseCommand import BaseCommand
from utils.assets.eventUrls import EVENTURLS 
from utils.dataclasses.odyssey import Odyssey
from utils.dataclasses.main import Body
from utils.dataclasses.metaData import MetaBody 

def validateTitle(isExtreme: bool, difficulty: str) -> str:

    if isExtreme:
        title = f"Difficulty: {difficulty.title()}, Extreme" 
    else:
        title = f"Difficulty: {difficulty.title()}"
 
    return title


def getAllMaps(maps: dict, eventData: dict, emotes: dict) -> None:

    for index, map in enumerate(maps["body"],start=1):
        mapData = BaseCommand.transformDataToDataClass(MetaBody, map) 
        modifiers = BaseCommand.getActiveModifiers(mapData, emotes)

        selectedMode = BaseCommand.splitUppercaseLetters(mapData.mode)
        selectedDifficulty = BaseCommand.splitUppercaseLetters(mapData.difficulty)
        selectedMap = BaseCommand.splitUppercaseLetters(mapData.map)
        title = f"{index}. {selectedMap} ({selectedDifficulty}, {selectedMode})"
        cash = f"<:Cash:{emotes.get('Cash')}> ${mapData.startingCash:,}"
        round = f"<:Round:{emotes.get('Round')}> {mapData.startRound}/{mapData.endRound}"

        value = [f"{cash}, {round}\n{', '.join(modifiers)}", False] 
        eventData[title] = value
             

def odysseyProfile(index: int, difficulty: str):

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/odyssey",
        "extension": f"metadata_{difficulty}"
    }
    
    data = BaseCommand.getCurrentEventData(urls, index)
    eventMetaData = BaseCommand.useApiCall(data.get("MetaData", None))
    mainData = BaseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = BaseCommand.transformDataToDataClass(Odyssey, eventMetaData)
    emotes = BaseCommand.getAllEmojis()
    eventURL = EVENTURLS["Odyssey"][difficulty]

    body = metaData.body   

    title = (
        f"{validateTitle(body.isExtreme, difficulty)}\n"
        f"Lives: <:Lives:{emotes.get('Lives')}> {body.startingHealth}\n"
        f"Max Seats: {body.maxMonkeySeats}\n"
        f"Max Monkeys: {body.maxMonkeysOnBoat}"
    )

    towers = BaseCommand.getActiveTowers(body._availableTowers, emotes)

    eventData = {
        mainData.name: [title, False],
        "Heroes": ["\n".join(towers.get("Heroes", None)), False],
        "Primary": ["\n".join(towers.get("Primary", None)), True],
        "Military": ["\n".join(towers.get("Military", None)), True],
        "": ["\n", False],
        "Magic": ["\n".join(towers.get("Magic", None)), True],
        "Support": ["\n".join(towers.get("Support", None)), True]
        }

    mapsURL = body.maps
    mapsData = BaseCommand.useApiCall(mapsURL)
    getAllMaps(mapsData, eventData, emotes) #add the maps data -> each difficulty has a set amount of maps

    eventNumber = BaseCommand.getCurrentEventNumber(mainData.start, "odyssey")
    embed = BaseCommand.createEmbed(eventData, eventURL, title=f"Odyssey #{eventNumber}")
    names = data.get("Names", None)

    return embed, names
