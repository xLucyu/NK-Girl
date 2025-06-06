from cogs.baseCommand import BaseCommand
from utils.assets.eventUrls import EVENTURLS
from utils.dataclasses.metaData import MetaData
from utils.dataclasses.main import Body


def bossProfile(index: int, difficulty: str):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extension": f"metadata{difficulty.title()}"
    }

    baseCommand = BaseCommand()    

    data = baseCommand.getCurrentEventData(urls, index)
    eventMetaData = baseCommand.useApiCall(data.get("MetaData", None))
    mainData = baseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = baseCommand.transformDataToDataClass(MetaData, eventMetaData)
    emotes = baseCommand.getAllEmojis()

    body = metaData.body

    selectedMap = baseCommand.splitUppercaseLetters(body.map)
    selectedDifficulty = baseCommand.splitUppercaseLetters(body.difficulty)
    selectedMode = baseCommand.splitUppercaseLetters(body.mode)

    lives = f"<:Lives:{emotes.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {body.startRound}/{metaData.body.endRound}"
     
    bossLeaderboardType = {
        "GameTime": f"<:EventRace:{emotes.get('EventRace')}> **Timed Leaderboard**",
        "LeastCash": f"<:LeastCash:{emotes.get('LeastCash')}> **Least Cash Leaderboard**",
        "LeastTiers": f"<:LeastTiers:{emotes.get('LeastTiers')}> **Least Tiers Leaderboard**"
    }

    lbScoringType = bossLeaderboardType.get(mainData.scoringType)
    modifiers = baseCommand.getActiveModifiers(body, emotes) 
    towers = baseCommand.getActiveTowers(body._towers, emotes) 

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
 
    eventNumber = baseCommand.splitBossNames(mainData.name)
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][mainData.bossType.title()]
    embed = baseCommand.createEmbed(eventData, eventURL, title=f"{eventNumber}")
    names = list()

    for name in data.get("Names", []):
        names.append(baseCommand.splitBossNames(name))

    return embed, names
