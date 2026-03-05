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
from utils.dataclasses import (
    MetaData,
    EventResult,
    PreviousEventLabel
)

def raceProfile(eventContext: ProfileContext[MetaData]) -> EventResult:
     
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
        
    eventNumber = getNumberForEvent(mainData, "Race")
    embed = filterEmbed(eventData, RACE_IMAGE, title=f"Race #{eventNumber}")
    embed.set_image(url=MAPS_IMAGE[selectedMap])

    return EventResult(
        embed = embed,
        previousEvents = [
            PreviousEventLabel(
                label = splitUppercase(event.name),
                value = event.id,
                description = f"{timeStampToUTCTimeFormat(event.start)} - {timeStampToUTCTimeFormat(event.end)}"
            ) 
            for event in eventContext.mainData.previousEvents
        ]
    )
