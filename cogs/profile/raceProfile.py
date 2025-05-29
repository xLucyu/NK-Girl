import dacite 
from cogs.baseCommand import BaseCommand
from cogs.eventNumber import getCurrentEventNumber
from cogs.regex import splitUppercase
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

    # fetch data from urls.base 
    data = baseCommand.getCurrentEventData(urls, index)
    if not data:
        return 

    mainData = dacite.from_dict(data_class=Body, data=data["Data"])
    
    #fetch data from metadata 
    eventMetaData = baseCommand.useApiCall(data.get("MetaData", None)) 
    metaData = dacite.from_dict(data_class=MetaData, data=eventMetaData)

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
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        }  
    
    currentTimeStamp = mainData.start   
    firstTimeStamp = 1544601600000
    eventNumber = getCurrentEventNumber(currentTimeStamp, firstTimeStamp)
    embed = baseCommand.createEmbed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    names = data.get("Names") 

    return embed, names 
