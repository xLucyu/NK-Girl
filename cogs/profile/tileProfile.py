from cogs.regex import splitUppercase
from utils.assets.eventUrls import EVENTURLS
from cogs.baseCommand import BaseCommand
from utils.dataclasses.ct import TileCode


subGameType = {
    2: ["Race", "race"],
    4: ["Boss", "standard"],
    8: ["Least Cash", "least_cash"],
    9: ["Least Tiers", "least_tiers"]
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



'''
def getEmoteID(tileType: str, emotes: dict, relicType: str) -> str:

    match tileType:
        case "Relic":
            name, emoteid = next(((name, eid) for name, eid in emotes.items() if name == relicType), (None, None))
        case "Banner":
            name, emoteid = "Banner", emotes.get("Banner")
        case _:
            name, emoteid = "Regular", emotes.get("Regular")

    return f"<:{name}:{emoteid}>" 
'''




'''
def getSpecialTiles(body: dict, eventIndex: int):

    relicTiles = list()
    bannerTiles = list() 
    for _, tile in body.items():

        tileType = tile.get("TileType", None)
        tileCode = tile.get("Code", None)

        match tileType:

            case "Banner":
                bannerTiles.append(tileCode)
            case "Relic":
                relicTiles.append(tileCode)

    
    bannerTiles.append(eventIndex)
    relicTiles.append(eventIndex)
    categorizedTiles = [bannerTiles, relicTiles]
    return categorizedTiles

'''

def getHeadData(ctData: TileCode) -> dict:
    
    selectedMap = splitUppercase(ctData.GameData.selectedMap)
    selectedMode = splitUppercase(ctData.GameData.selectedMode)
    selectedDifficulty = splitUppercase(ctData.GameData.selectedDifficulty)
    gameType = ctData.GameData.subGameType 
    startingLives = livesForDifficulty.get(selectedDifficulty if selectedDifficulty else "Medium") #pyright fix lol 

    if gameType == 4: #boss 
        bossName = bossType.get(ctData.GameData.bossData.bossBloon, 1)
        eventURL = EVENTURLS["Boss"]["standard"]["Image"][bossName]
        bossTiers = ctData.GameData.bossData.TierCount
        head = f"{selectedMap} - {selectedDifficulty} {bossName} {bossTiers} Tier"
        endRound = 40 if bossTiers == 1 else 60 #only 2 boss tiers possible
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

    baseCommand = BaseCommand() 

    data = baseCommand.useApiCall(f"{urls["base"]}/{urls["extensions"]}") 
    ctData = baseCommand.transformDataToDataClass(TileCode, data.get(tileCode.upper(), None))    
    emotes = baseCommand.getAllEmojis()
    dcModel = ctData.GameData.dcModel

    tileType = ctData.TileType
    relicType = ctData.RelicType 
 
    ctInfo = getHeadData(ctData)  
    
    modifiers = baseCommand.getActiveModifiersForCt(dcModel, emotes)
    towers = baseCommand.getActiveTowers(dcModel.towers._items, emotes)

    lives = f"<:Lives:{emotes.get("Lives")}> {ctInfo["Lives"]}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${dcModel.startRules.cash:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {dcModel.startRules.round}/{ctInfo["EndRound"]}"
     
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
     
    embed = baseCommand.createEmbed(eventData, eventURL, title=f"{emoteid} Contested Territory #{eventIndex} - Tile {tileCode.upper()}")
    embed.set_image(url=EVENTURLS["Maps"][selectedMap])
    return embed, categorizedTiles
