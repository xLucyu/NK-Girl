from utils.assets.eventUrls import EVENTURLS
from cogs.baseCommand import BaseCommand
from utils.dataclasses.ct import TileCode
from utils.dataclasses.main import NkData

subGameType = {
    2: ["Race", "race", "EventRace"],
    4: ["Boss", "standard", "BossChallenge"],
    8: ["Least Cash", "least_cash", "LeastCash"],
    9: ["Least Tiers", "least_tiers", "LeastTiers"]
}

bossType = {
    0: "Bloonarius",
    1: "Lych",
    2: "Vortex",
    3: "Dreadbloon",
    4: "Phayze",
    5: "Blastapopoulos"
}

livesForDifficulty = {
    "Easy": 200,
    "Medium": 150,
    "Hard": 100
}

def getCurrentCtNumber() -> int:

    url = "https://data.ninjakiwi.com/btd6/ct"
    
    ctList = BaseCommand.useApiCall(url)
    ctListBody = BaseCommand.transformDataToDataClass(NkData, ctList)
    ctTimeStamp = ctListBody.body[0].start
    return BaseCommand.getCurrentEventNumber(ctTimeStamp, "ct")


def getEmoteID(tileType: str, emotes: dict, relicType: str) -> str:

    match tileType:
        case "Relic":
            name, emoteid = relicType, emotes.get(relicType)
        case "Banner":
            name, emoteid = "Banner", emotes.get("Banner")
        case _:
            name, emoteid = "Regular", emotes.get("Regular")

    return f"<:{name}:{emoteid}>" 

def getSpecialTiles(data: dict, emotes: dict) -> list:
    
    relicTiles = list()
    bannerTiles = list() 
    for _, tile in data.items():

        tileData = BaseCommand.transformDataToDataClass(TileCode, tile) 
        tileType = tileData.TileType 
        tileCode = tileData.Code
        currentSubGameType = tileData.GameData.subGameType

        match tileType:
            case "Banner":
                bannerType = subGameType[currentSubGameType][-1]

                if bannerType == "BossChallenge":
                    bannerType = bossType[tileData.GameData.bossData.bossBloon] #add the boss emote itself 

                bannerTiles.append([tileCode, f"<:{bannerType}:{emotes.get(bannerType)}>"]) #<:Dreadbloon:1383423718147096697>

            case "Relic":
                relicType = tileData.RelicType
                relicTiles.append([tileCode, f"<:{relicType}:{emotes.get(relicType)}>"])
 
    categorizedTiles = [bannerTiles, relicTiles]
    return categorizedTiles

def getHeadData(ctData: TileCode) -> dict:
    
    selectedMap = BaseCommand.splitUppercaseLetters(ctData.GameData.selectedMap)
    selectedMode = BaseCommand.splitUppercaseLetters(ctData.GameData.selectedMode)
    selectedDifficulty = BaseCommand.splitUppercaseLetters(ctData.GameData.selectedDifficulty)
    gameType = ctData.GameData.subGameType 
    startingLives = livesForDifficulty.get(selectedDifficulty if selectedDifficulty else "Medium") 

    if gameType == 4: #boss 
        bossName = bossType.get(ctData.GameData.bossData.bossBloon, 1)
        eventURL = EVENTURLS["Boss"]["standard"]["Image"][bossName]
        bossTiers = ctData.GameData.bossData.TierCount
        head = f"{selectedMap} - {selectedDifficulty} {bossName} {bossTiers} Tier"
        endRound = f"{20 * bossTiers + 20}+"
    else: 
        eventGameType = subGameType.get(gameType, {})
        eventURL = EVENTURLS[eventGameType[0]][eventGameType[1]]
        head = f"{selectedMap} - {selectedDifficulty}, {selectedMode}"
        endRound = ctData.GameData.dcModel.startRules.endRound

    return {
        "Head": head,
        "Map": selectedMap,
        "Lives": startingLives,
        "EndRound": endRound,
        "EventURL": eventURL
    }


def tileProfile(eventIndex: int, tileCode: str):
 
    urls = {
        "base": "https://storage.googleapis.com/btd6-ct-map/events",
        "extensions": f"{eventIndex}/tiles.json"
    } 
    
    try:
        data = BaseCommand.useApiCall(f"{urls["base"]}/{urls["extensions"]}") # incase user enters invalid event number 
    except:
        raise ValueError("CTNotFound")
    
    if tileCode.upper() not in data:
        raise ValueError("TileNotFound")

    
    ctData = BaseCommand.transformDataToDataClass(TileCode, data.get(tileCode.upper(), None))    
    emotes = BaseCommand.getAllEmojis()
    dcModel = ctData.GameData.dcModel 
 
    ctInfo = getHeadData(ctData) 
    categorizedTiles = getSpecialTiles(data, emotes)

    lives = f"<:Lives:{emotes.get("Lives")}> {ctInfo["Lives"]}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${dcModel.startRules.cash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {dcModel.startRules.round}/{ctInfo["EndRound"]}"

    modifiers = BaseCommand.getActiveModifiersForCt(dcModel, emotes)
    towers = BaseCommand.getActiveTowers(dcModel.towers._items, emotes)
     
    eventData = {
        ctInfo.get("Head"): ["\n", False],
        "Lives": [lives, True],
        "Cash": [cash, True],
        "Rounds": [rounds, True],
        "Modifiers": ["\n".join(modifiers), False],
        "Heroes": ["\n".join(towers.get("Heroes", None)), False],
        "Primary": ["\n".join(towers.get("Primary", None)), True],
        "Military": ["\n".join(towers.get("Military", None)), True],
        "": ["\n", False],
        "Magic": ["\n".join(towers.get("Magic", None)), True],
        "Support": ["\n".join(towers.get("Support", None)), True],
        } 
     
    currentEmote = getEmoteID(ctData.TileType, emotes, ctData.RelicType)

    print(currentEmote)
     
    embed = BaseCommand.createEmbed(eventData,
                                    ctInfo["EventURL"], 
                                    title=f"{currentEmote} Contested Territory #{eventIndex} - Tile {tileCode.upper()}"
                                    )
    embed.set_image(url=EVENTURLS["Maps"][ctInfo["Map"]])
    return embed, categorizedTiles
