from utils.assets.eventUrls import EVENTURLS
from api.eventContext import ProfileContext
from utils.helperFunctions import (
    splitUppercase,
    filterModifiers, 
    filterTowers,
    splitNumbers,
    filterEmbed
)


def bossProfile(eventContext: ProfileContext): 

    body = eventContext.metaData.body
    mainData = eventContext.mainData.selectedID
    emotes = eventContext.emojiData
    difficulty = eventContext.difficulty

    selectedMap = splitUppercase(body.map)
    selectedDifficulty = splitUppercase(body.difficulty)
    selectedMode = splitUppercase(body.mode)

    lives = f"<:Lives:{emotes.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {body.startRound}/{body.endRound}"
     
    bossLeaderboardType = {
        "GameTime": f"<:EventRace:{emotes.get('EventRace')}> **Timed Leaderboard**",
        "LeastCash": f"<:LeastCash:{emotes.get('LeastCash')}> **Least Cash Leaderboard**",
        "LeastTiers": f"<:LeastTiers:{emotes.get('LeastTiers')}> **Least Tiers Leaderboard**"
    }
    
    lbTypeKey = mainData.eliteScoringType if difficulty == "elite" else mainData.normalScoringType
    lbScoringType = bossLeaderboardType.get(lbTypeKey, None)

    modifiers = filterModifiers(body, emotes) 
    towers = filterTowers(body._towers, emotes) 

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
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][mainData.bossType.title()]
    embed = filterEmbed(eventData, eventURL, title=f"{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])

    previousEvents = [splitNumbers(event) for event in eventContext.mainData.previousEvents]

    return {
        "Embed": embed,
        "PreviousEvents": previousEvents
    }
