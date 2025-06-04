from cogs.baseCommand import BaseCommand
from utils.assets.eventUrls import EVENTURLS
from utils.dataclasses.main import Body 
from utils.dataclasses.metaData import MetaData


def raceProfile(index, difficulty=None):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/races",
        "extension": "metadata"
    }

    baseCommand = BaseCommand()   
    eventURL = EVENTURLS["Race"]["race"]

    data = baseCommand.getCurrentEventData(urls, index)
    eventMetaData = baseCommand.useApiCall(data.get("MetaData", None))
    mainData = baseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = baseCommand.transformDataToDataClass(MetaData, eventMetaData)
    emotes = baseCommand.getAllEmojis()
 
    body = metaData.body 

    selectedMap = splitUppercase(body.map)
    selectedDifficulty = splitUppercase(body.difficulty)
    selectedMode = splitUppercase(body.mode)

    lives = f"<:Lives:{emotes.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {body.startRound}/{metaData.body.endRound}"

    modifiers = baseCommand.getActiveModifiers(body, emotes) 
    towers = baseCommand.getActiveTowers(body._towers, emotes) 

    eventData = { 
        metaData.body.name: [f"{selectedMap}, {selectedDifficulty} - {selectedMode}", False],
        "Modifiers": ["\n".join(modifiers), False], 
        "Lives": [lives, True],
        "Cash": [cash, True],
        "Rounds": [rounds, True],
        "Heroes": ["\n".join(towers.get("Heroes", None)), False],
        "Primary": ["\n".join(towers.get("Primary", None)), True],
        "Military": ["\n".join(towers.get("Military", None)), True],
        "": ["\n", False],
        "Magic": ["\n".join(towers.get("Magic", None)), True],
        "Support": ["\n".join(towers.get("Support", None)), True],
        }  
    
    currentTimeStamp = mainData.start    
    eventNumber = getCurrentEventNumber(currentTimeStamp, firstTimeStamp)
    embed = baseCommand.createEmbed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    names = data.get("Names") 

    return embed, names 
