from utils.dataclasses.main import Body 
from utils.dataclasses.metaData import MetaData


def raceProfile(index: int = None, difficulty: str = None):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/races",
        "extension": "metadata"
    } 

    data = BaseCommand.getCurrentEventData(urls, index)
    eventMetaData = BaseCommand.useApiCall(data.get("MetaData", None))
    mainData = BaseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = BaseCommand.transformDataToDataClass(MetaData, eventMetaData)
    emotes = BaseCommand.getAllEmojis()
 
    body = metaData.body 

    selectedMap = BaseCommand.splitUppercaseLetters(body.map)
    selectedDifficulty = BaseCommand.splitUppercaseLetters(body.difficulty)
    selectedMode = BaseCommand.splitUppercaseLetters(body.mode)

    lives = f"<:Lives:{emotes.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {body.startRound}/{metaData.body.endRound}"

    modifiers = BaseCommand.getActiveModifiers(body, emotes) 
    towers = BaseCommand.getActiveTowers(body._towers, emotes) 

    eventData = { 
        body.name: [f"{selectedMap}, {selectedDifficulty} - {selectedMode}", False],
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
        
    eventNumber = BaseCommand.getCurrentEventNumber(mainData.start, "race") 
    eventURL = EVENTURLS["Race"]["race"]
    embed = BaseCommand.createEmbed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    names = data.get("Names") 

    return {
        "Embed": embed,
        "Names": names,
        "Index": index
    } 
