from api.eventContext import ProfileContext
from utils.helperFunctions import (
    splitUppercase,
    filterModifiers, 
    filterTowers,
    splitNumbers,
    filterEmbed
)
from utils.assets import (
    BOSS_IMAGE,
    MAPS_IMAGE
)


def bossProfile(eventContext: ProfileContext): 
   

    body = eventContext.metaData.body
    mainData = eventContext.mainData.selectedID
    emojis = eventContext.emojiData
    difficulty = eventContext.difficulty

    selectedMap = splitUppercase(body.map)
    selectedDifficulty = splitUppercase(body.difficulty)
    selectedMode = splitUppercase(body.mode)

    lives = f"<:Lives:{emojis.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emojis.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emojis.get('Round')}> {body.startRound}/{body.endRound}"
     
    bossLeaderboardType = {
        "GameTime": f"<:EventRace:{emojis.get('EventRace')}> **Timed Leaderboard**",
        "LeastCash": f"<:LeastCash:{emojis.get('LeastCash')}> **Least Cash Leaderboard**",
        "LeastTiers": f"<:LeastTiers:{emojis.get('LeastTiers')}> **Least Tiers Leaderboard**"
    }
    
    lbTypeKey = mainData.eliteScoringType if difficulty == "elite" else mainData.normalScoringType
    lbScoringType = bossLeaderboardType.get(lbTypeKey, None)

    modifiers = filterModifiers(body, emojis) 
    towers = filterTowers(body._towers, emojis) 

    if mainData.bossType.lower() not in body.roundSets:
        rounds += " (Custom Rounds)"

    eventData = { 
        f"{difficulty.title()} Difficulty": [f"{selectedMap}, {selectedDifficulty} - {selectedMode}", False],
        "Modifiers": [f"{"\n".join(modifiers)} \n\n{lbScoringType}", False], 
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
 
    eventNumber = splitNumbers(mainData.name)
    eventURL = BOSS_IMAGE[difficulty]["Image"][mainData.bossType.title()]
    embed = filterEmbed(eventData, eventURL, title=f"{eventNumber}")
    embed.set_image(url=MAPS_IMAGE[selectedMap])

    previousEvents = [splitNumbers(event) for event in eventContext.mainData.previousEvents]

    return {
        "Embed": embed,
        "PreviousEvents": previousEvents
    }
