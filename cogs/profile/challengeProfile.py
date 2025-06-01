from datetime import datetime, timezone 
from utils.assets.eventUrls import EVENTURLS
from cogs.regex import splitUppercase 
from cogs.eventNumber import getcurrentDailyNumber
from cogs.baseCommand import BaseCommand
from utils.dataclasses.main import NkData 
from utils.dataclasses.metaData import MetaData 


def findIndexForCurrentDailyChallenge(challenges: NkData, difficulty: str) -> int: 
    challengeListBody = challenges.body 
    currentTimeStamp = int(datetime.now(timezone.utc).timestamp() * 1000)
    firstTimeStamp = 1535097600000 if difficulty == "advanced" else 1533974400000 #time stamps for even #1
    dailyChallengeNumber = getcurrentDailyNumber(firstTimeStamp, currentTimeStamp)
 
    for index, challenge in enumerate(challengeListBody): 
        eventName = challenge.name 

        if difficulty != "coop" and str(dailyChallengeNumber) in eventName:
            return index

        eventTimeStamp = challenge.createdAt
        currentDay = datetime.now().weekday()
        currentTimeStamp = int(datetime.now(timezone.utc).timestamp() * 1000)
        if currentDay in [6, 0, 1]:
            eventDuration = 86400000 * 3 # 3 days 
        else:
            eventDuration = 86400000 * 4 # 4 days 
         
        if eventTimeStamp <= currentTimeStamp <= eventTimeStamp + eventDuration and difficulty in eventName: 
            return index 

    return 0
 
         
def challengeProfile(index=None, difficulty=None): 
    baseCommand = BaseCommand() 
   
    if difficulty is None:
        url = f"https://data.ninjakiwi.com/btd6/challenges/challenge/{index}"
        challengeData = baseCommand.useApiCall(url)
        metaData = baseCommand.transformDataToDataClass(MetaData, challengeData)

    else:
        urls = {
            "base": "https://data.ninjakiwi.com/btd6/challenges/filter/daily",
            "extension": "metadata"
        }

        challenges = baseCommand.useApiCall(urls["base"]) 
        challengesData = baseCommand.transformDataToDataClass(NkData, challenges) 
        index = findIndexForCurrentDailyChallenge(challengesData, difficulty)
        data = baseCommand.getCurrentEventData(urls, index)
        eventMetaData = baseCommand.useApiCall(data.get("MetaData", None)) 
        metaData = baseCommand.transformDataToDataClass(MetaData, eventMetaData)

    if metaData.success == False:
        raise ValueError("ChallengeCodeNotFound")

    emotes = baseCommand.getAllEmojis()

    body = metaData.body
    challengeCreator = body.creator  
    challengeID = body.id  

    if difficulty is None and challengeCreator:  
        creator = baseCommand.useApiCall(url=challengeCreator)

        if not creator:
            return None

        creatorName = creator["body"]["displayName"] #dont feel like making a dataclass just for this 
        title = f"{creatorName}'s Challenge, Code: {index}"
        eventURL = EVENTURLS["Challenge"]["challenge"]

    else:
        challengeDate = f"{challengeID[-2:]}/{challengeID[-4:-2]}/{challengeID[-8:-4]}"
        title = f"{difficulty.title()} Challenge {challengeDate}"
        eventURL = EVENTURLS["Challenge"]["daily"]
     
    selectedMap = splitUppercase(body.map)
    selectedDifficulty = splitUppercase(body.difficulty)
    selectedMode = splitUppercase(body.mode)

    lives = f"<:Lives:{emotes.get('Lives')}> {body.lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${body.startingCash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {body.startRound}/{metaData.body.endRound}"

    modifiers = baseCommand.getActiveModifiers(body, emotes) 
    towers = baseCommand.getActiveTowers(body._towers, emotes) 

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
     
    embed = baseCommand.createEmbed(eventData, eventURL, title)
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    modes = ["placeholder"]

    return embed, modes 
