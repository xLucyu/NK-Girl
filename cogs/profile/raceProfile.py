from api.eventContext import ProfileContext
from utils.helperFunctions import (
    filterModifiers, 
    filterTowers, 
    splitUppercase,
    getNumberForEvent,
    filterEmbed,
    timeStampToUTCTimeFormat
)
from utils.assets import (
    RACE_IMAGE,
    MAPS_IMAGE
)

def raceProfile(eventContext: ProfileContext):
     
    mainData = eventContext.mainData.selectedID
    emojis = eventContext.emojiData
    body = eventContext.metaData.body

    lives = f"<:Lives:{emojis.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emojis.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emojis.get('Round')}> {body.startRound}/{body.endRound}"

    selectedMap = splitUppercase(body.map)
    selectedDifficulty = splitUppercase(body.difficulty)
    selectedMode = body.mode

    modifiers = filterModifiers(body, emojis) 
    towers = filterTowers(body._towers, emojis) 

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
        
    eventNumber = getNumberForEvent(mainData, "race")
    eventURL = RACE_IMAGE
    embed = filterEmbed(eventData, eventURL, title=f"Race #{eventNumber}")
    embed.set_image(url=MAPS_IMAGE[selectedMap])

    previousEvents = [{
        "label": splitUppercase(event.name),
        "value": event.id,
        "description": f"{timeStampToUTCTimeFormat(event.eventStart)} - {timeStampToUTCTimeFormat(event.eventEnd)}"
    } for event in eventContext.mainData.previousEvents]

    return {
        "Embed": embed,
        "PreviousEvents": previousEvents
    } 
