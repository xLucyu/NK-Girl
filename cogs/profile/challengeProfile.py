from api.fetchid import getData
from utils.assets.urls import EVENTURLS
from utils.filter.embedfilter import filterembed
from cogs.basecommand import baseCommand
from cogs.regex import splitUppercase
from datetime import datetime, timezone


def findIndex(urls: dict, difficulty: str):
    
    challenges = getData(urls.get("base", None))
    if challenges is None:
        return None

    challengeList = challenges.get("body", None) 
    currentTimeStamp = int(datetime.now(timezone.utc).timestamp() * 1000) 
     
    for index, challenge in enumerate(challengeList):
        

        eventTimeStamp = challenge.get("createdAt") 
        if difficulty != "coop":
            eventTimeStamp -= 28_800_000

        if difficulty == "coop":
            currentDay = datetime.now().weekday()
            if currentDay in [6, 0, 1]:
                eventDuration = 86400000 * 3
            else:
                eventDuration = 86400000 * 4
        else:
            eventDuration = 86_400_000 # 1 day


        eventName = challenge.get("name") 
         
        if eventTimeStamp <= currentTimeStamp <= eventTimeStamp + eventDuration and difficulty in eventName: 
            return index 
 
         

def challengeProfile(index=None, difficulty=None):
    
    if difficulty is None:
        urls = f"https://data.ninjakiwi.com/btd6/challenges/challenge/{index}" #challenge code 
        NKDATA = baseCommand(urls, index=None)

    else:
        urls = {
            "base": "https://data.ninjakiwi.com/btd6/challenges/filter/daily",
            "extension": "metadata"
        }
        currentDaily = findIndex(urls, difficulty)
        NKDATA = baseCommand(urls, currentDaily)
 
    if not NKDATA:
        return 

    stats = NKDATA.get("Stats", None)
    towers = NKDATA.get("Towers", None)
    modifiers = NKDATA.get("Modifiers", None)
    challengeKey = stats.get("Challenge")
    creator = challengeKey.get("Creator")
    name = challengeKey.get("Name")
    challengeID = challengeKey.get("ID")

    if difficulty is None:  
        creator = getData(url=creator)

        if not creator:
            return None

        creatorName = creator["body"]["displayName"] #type: ignore
        title = f"{creatorName}'s Challenge, Code: {index}"
        eventURL = EVENTURLS["Challenge"]["challenge"]

    else:
        challengeDate = f"{challengeID[-2:]}/{challengeID[-4:-2]}/{challengeID[-8:-4]}"
        title = f"{difficulty.title()} Challenge {challengeDate}"
        eventURL = EVENTURLS["Challenge"]["daily"]
     
    map = splitUppercase(stats.get("Map"))
    difficulty = splitUppercase(stats.get("Difficulty"))
    mode = splitUppercase(stats.get("Mode")) 

    eventData = { 
        name: [f"{map}, {difficulty} - {mode}", False],
        "Modifiers": ["\n".join(modifiers), False],
        "Lives": [f"<:Lives:1337794403019915284> {stats.get('Lives')}", True],
        "Cash": [f"<:cash:1338140224353603635> ${stats.get('Cash'):,}", True],
        "Rounds": [f"<:Round:1342535466855038976> {stats.get('StartRound')}/{stats.get('EndRound')}", True],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        }

    embed = filterembed(eventData, eventURL, title)
    embed.set_image(url=EVENTURLS["Maps"][map])
    return embed
