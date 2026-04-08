from utils.assets import CATEGORIES, ODYSSEY_IMAGE
from utils.dataclasses import (
    Odyssey,
    OdysseyBody,
    MapsData,
    EventResult,
    PreviousEventLabel
)


def mapsURLResolver(main: Odyssey) -> str:
    return main.body.maps  


def getReward(body: OdysseyBody) -> str: 

    importantReward = body._rewards[-1]
    rewardType, rewardValue = importantReward.split(":")

    if rewardType == "InstaMonkey":

        name, tier = rewardValue.split(",")

        formattedTowerName = next(
            easyName for towers in CATEGORIES.values() 
            for tower, easyName in towers.items() 
            if tower == name
        )

        return f"{formattedTowerName} ({tier})"
    
    elif rewardType == "CollectionEvent":
        return f"{rewardValue} Totems"
    
    else:
        return splitUppercase(rewardValue)


def validateTitle(isExtreme: bool, difficulty: str) -> str:

    title = f"Difficulty: {difficulty.title()}"
    title += ", Extreme" if isExtreme else ""
 
    return title


def getAllMaps(maps: MapsData, eventData: dict, emojis: dict) -> None:

    if not maps:
        return

    for index, map in enumerate(maps.body, start=1):

        modifiers = filterModifiers(maps, emojis)

        selectedMode = splitUppercase(map.mode)
        selectedDifficulty = splitUppercase(map.difficulty)
        selectedMap = splitUppercase(map.map)

        title = f"{index}. {selectedMap} ({selectedDifficulty}, {selectedMode})"
        cash = f"<:Cash:{emojis.get('Cash')}> ${map.startingCash:,}"
        round = f"<:Round:{emojis.get('Round')}> {map.startRound}/{map.endRound}"

        value = [f"{cash}, {round}\n{', '.join(modifiers)}", False] 
        eventData[title] = value
             

def odysseyProfile() -> EventResult:

    mainData = eventContext.mainData.selectedID
    body = eventContext.metaData.body
    emojis = eventContext.emojiData  

    title = (
        f"{validateTitle(body.isExtreme, eventContext.difficulty)}\n"
        f"Lives: <:Lives:{emojis.get('Lives')}> {body.startingHealth}\n"
        f"Max Seats: {body.maxMonkeySeats}\n"
        f"Max Monkeys: {body.maxMonkeysOnBoat}"
    )

    towers = filterTowers(body._availableTowers, emojis) 
    reward = getReward(body)

    eventData = {
        mainData.name: [title, False],
        "Reward": [f"<:Reward:{emojis.get("Reward", None)}> {reward}", False],
        "Heroes": ["\n".join(towers.get("Heroes", None)), False],
        "Primary": ["\n".join(towers.get("Primary", None)), True],
        "Military": ["\n".join(towers.get("Military", None)), True],
        "": ["\n", False],
        "Magic": ["\n".join(towers.get("Magic", None)), True],
        "Support": ["\n".join(towers.get("Support", None)), True]
        }

    eventNumber = getNumberForEvent(getCurrentTimeStamp(), "Odyssey")
    getAllMaps(eventContext.secondaryData, eventData, emojis)
    embed = filterEmbed(eventData, ODYSSEY_IMAGE, f"Odyssey #{eventNumber}")

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
