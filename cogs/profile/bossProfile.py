from cogs.baseCommand import baseCommand
from cogs.regex import splitNumbers, splitUppercase
from utils.filter.createEmbed import filterembed
from utils.assets.eventUrls import EVENTURLS

def bossProfile(index: int, difficulty: str):
     
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extension": f"metadata{difficulty.title()}"
    }

    NKDATA = baseCommand(urls, index)
    
    if not NKDATA:
        return 
    
    api = NKDATA.get("Api", None) 
    apiData = api.get("Data", None) 
    stats = NKDATA.get("Stats", None)
    emotes = NKDATA.get("Emotes", None)
    modifiers = NKDATA.get("Modifiers", None)
    towers = NKDATA.get("Towers", None)
     
    bossLeaderboardType = {
        "GameTime": f"<:EventRace:{emotes.get('EventRace')}> **Timed Leaderboard**",
        "LeastCash": f"<:LeastCash:{emotes.get('LeastCash')}> **Least Cash Leaderboard**",
        "LeastTiers": f"<:LeastTiers:{emotes.get('LeastTiers')}> **Least Tiers Leaderboard**"
    }

    name = apiData.get("bossType", None) 
    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name.title()]
    map = splitUppercase(stats.get("Map")) 
    modeDifficulty = splitUppercase(stats.get("Difficulty"))
    mode = splitUppercase(stats.get("Mode"))
    lbtype = bossLeaderboardType[apiData.get("scoringType", "GameTime")]

    if difficulty == "standard":
        difficulty = "normal"
    
    lives = f"<:Lives:{emotes.get('Lives')}> {stats.get('Lives')}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${stats.get('Cash'):,}"
    rounds = f"<:Round:{emotes.get('Round')}> {stats.get('StartRound')}/{stats.get('EndRound')}"

    eventData = { 
        f"{difficulty.title()} Difficulty": [f"{map}, {modeDifficulty} - {mode}", False],
        "Modifiers": [f"{'\n'.join(modifiers)} \n\n{lbtype}", False],
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
     
    eventNumber = splitNumbers(apiData.get("name", None))
    embed = filterembed(eventData, eventURL, title=f"{eventNumber}")
    embed.set_image(url=EVENTURLS["Maps"][map])
    names = list()

    for name in api.get("Names", []):
        names.append(splitNumbers(name))

    return embed, names
