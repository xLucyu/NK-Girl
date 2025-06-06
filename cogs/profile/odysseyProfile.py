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


def getAllMaps(maps: dict, eventData: dict, emotes: dict, baseCommand: BaseCommand) -> None:
    for index, map in enumerate(maps["body"],start=1):
        mapData = baseCommand.transformDataToDataClass(MetaBody, map) 
        modifiers = baseCommand.getActiveModifiers(mapData, emotes)

        selectedMode = baseCommand.splitUppercaseLetters(mapData.mode)
        selectedDifficulty = baseCommand.splitUppercaseLetters(mapData.difficulty)
        selectedMap = baseCommand.splitUppercaseLetters(mapData.map)
        title = f"{index}. {selectedMap} ({selectedDifficulty}, {selectedMode})"
        cash = f"<:Cash:{emotes.get('Cash')}> ${map.get('startingCash'):,}"
        round = f"<:Round:{emotes.get('Round')}> {map.get('startRound')}/{map.get('endRound')}"

        value = [f"{cash}, {round}\n{', '.join(modifiers)}", False] 
        eventData[title] = value
             

def odysseyProfile(index: int, difficulty: str):

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/odyssey",
        "extension": f"metadata_{difficulty}"
    }

    baseCommand = BaseCommand()
    
    data = baseCommand.getCurrentEventData(urls, index)
    eventMetaData = baseCommand.useApiCall(data.get("MetaData", None))
    mainData = baseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = baseCommand.transformDataToDataClass(Odyssey, eventMetaData)
    emotes = baseCommand.getAllEmojis()
    eventURL = EVENTURLS["Odyssey"][difficulty]

    body = metaData.body   

    title = (
        f"{validateTitle(body.isExtreme, difficulty)}\n"
        f"Lives: <:Lives:{emotes.get('Lives')}> {body.startingHealth}\n"
        f"Max Seats: {body.maxMonkeySeats}\n"
        f"Max Monkeys: {body.maxMonkeysOnBoat}"
    )

    towers = baseCommand.getActiveTowers(body._availableTowers, emotes)

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
    mapsData = baseCommand.useApiCall(mapsURL)
    getAllMaps(mapsData, eventData, emotes, baseCommand) #add the maps data -> each difficulty has a set amount of maps

    eventNumber = baseCommand.getCurrentEventNumber(mainData.start, "odyssey")
    embed = baseCommand.createEmbed(eventData, eventURL, title=f"Odyssey #{eventNumber}")
    names = data.get("Names", None)

    return embed, names
