from cogs.baseCommand import BaseCommand
from utils.assets.eventUrls import EVENTURLS
from utils.dataclasses.metaData import MetaData
from utils.dataclasses.main import Body

def bossProfile(index: int = None, difficulty: str = ""): 

    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extension": f"metadata{difficulty.title()}"
    }  

    index = BaseCommand.getCurrentIndexForEvent(index, urls["base"])

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
     
    bossLeaderboardType = {
        "GameTime": f"<:EventRace:{emotes.get('EventRace')}> **Timed Leaderboard**",
        "LeastCash": f"<:LeastCash:{emotes.get('LeastCash')}> **Least Cash Leaderboard**",
        "LeastTiers": f"<:LeastTiers:{emotes.get('LeastTiers')}> **Least Tiers Leaderboard**"
    }
    
    lbTypeKey = "eliteScoringType" if difficulty.lower() == "elite" else "normalScoringType"
    lbScoringType = bossLeaderboardType.get(getattr(mainData, lbTypeKey))
    modifiers = BaseCommand.getActiveModifiers(body, emotes) 
    towers = BaseCommand.getActiveTowers(body._towers, emotes) 

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
 
    eventNumber = BaseCommand.splitBossNames(mainData.name)
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][mainData.bossType.title()]
    embed = BaseCommand.createEmbed(eventData, eventURL, title=f"{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    names = list()

    for name in data.get("Names", []):
        names.append(BaseCommand.splitBossNames(name))

    return embed, names
