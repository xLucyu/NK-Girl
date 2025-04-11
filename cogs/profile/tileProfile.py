from cogs.regex import splitUppercase
from api.fetchId import getData
from api.metaData import getMetaData
from api.emojis import getEmojis
from utils.filter.filterTowers import filterTowers
from utils.filter.filterBloonsModifiers import filterModifiers
from utils.filter.createEmbed import filterembed
from utils.assets.eventUrls import EVENTURLS


def getCTdata(urls: dict, tileCode: str, eventIndex: int):
     
    try: 
        body = getData(url=f"{urls.get('base')}/{urls.get('extensions')}") 
        emotes = getEmojis()

        if not body:
            raise ValueError("CTNotFound") 
        
        if tileCode.upper() not in body:
            raise ValueError("TileNotFound")

        data = getMetaData(body.get(tileCode.upper()))
        categorizedTiles = getSpecialTiles(body, eventIndex) 
        
        return data, emotes, categorizedTiles
        
    except Exception as e:
        raise ValueError(e)


def getEmoteID(tileType: str, emotes: dict, relicType: str) -> str:

    match tileType:
        case "Relic":
            name, emoteid = next(((name, eid) for name, eid in emotes.items() if name == relicType), (None, None))
        case "Banner":
            name, emoteid = "Banner", emotes.get("Banner")
        case _:
            name, emoteid = "Regular", emotes.get("Regular")

    return f"<:{name}:{emoteid}>" 

def getHeadData(gameType: list, gameData: dict):
    
    bossType = {
        0: "Bloonarius",
        1: "Lych",
        2: "Vortex",
        3: "Dreadbloon",
        4: "Phayze",
        5: "Blastapopoulos"
    }

    livesfordifficulty = {
        "Easy": 200,
        "Medium": 150,
        "Hard": 100
    }

    map = splitUppercase(gameData.get("selectedMap", None))
    mode = splitUppercase(gameData.get("selectedMode", None))
    difficulty = splitUppercase(gameData.get("selectedDifficulty", None))
    lives = livesfordifficulty[difficulty]

    if gameType[0] == "Boss":
        bossname = bossType.get(gameData["bossData"]["bossBloon"], None)
        eventURL = EVENTURLS["Boss"]["standard"]["Image"][bossname]
        bossTiers = gameData["bossData"]["TierCount"]
        head = f"{map} - {difficulty} {bossname} {bossTiers} Tier"
        endRound = 40 if bossTiers == 1 else 60 #only 2 boss tiers possible
    else:
        eventURL = EVENTURLS[gameType[0]][gameType[1]]
        head = f"{map} - {difficulty}, {mode}"
        endRound = gameData["dcModel"]["startRules"]["endRound"]

    return head, eventURL, lives, endRound, map


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


def tileProfile(eventIndex: int, tileCode: str):
     
    urls = {
        "base": "https://storage.googleapis.com/btd6-ct-map/events",
        "extensions": f"{eventIndex}/tiles.json"
    }

    subGameType = {
        2: ["Race", "race"],
        4: ["Boss", "standard"],
        8: ["Least Cash", "least_cash"],
        9: ["Least Tiers", "least_tiers"]
    }

    NKDATA, emotes, categorizedTiles = getCTdata(urls, tileCode, eventIndex) #type: ignore   

    if not NKDATA or not emotes: 
        return  

    gameData = NKDATA["CT"]["GameData"]
    availableTowers = gameData["dcModel"]["towers"]["_items"]
    gameType = subGameType.get(gameData["subGameType"], None)
    tileType = NKDATA["CT"]["TileType"]
    relicType = NKDATA.get("CT", None).get("Relic", None) 
    
    if not gameType: 
        return
    
    head, eventURL, lives, endRound, map = getHeadData(gameType, gameData)  
    emoteid = getEmoteID(tileType, emotes, relicType)
 
    activeModifiers = { 
        "Bloon_Modifiers": gameData["dcModel"]["bloonModifiers"],
        "MKDisabled": gameData["dcModel"]["disableMK"],
        "NoSelling": gameData["dcModel"]["disableSelling"],
        "MaxTowers": gameData["dcModel"]["maxTowers"]
    }
    
    towers = filterTowers(availableTowers, emotes)
    modifiers = filterModifiers(activeModifiers, emotes)

    lives = f"<:Lives:{emotes.get('Lives')}> {lives}"
    cash = f"<:Cash:{emotes.get('Cash')}> ${gameData['dcModel']['startRules']['cash']:,}"
    rounds = f"<:Round:{emotes.get('Round')}> {gameData['dcModel']['startRules']['round']}/{endRound}"
     
    eventData = {
        head: ["\n", False],
        "Lives": [lives, True],
        "Cash": [cash, True],
        "Rounds": [rounds, True],
        "Modifiers": ["\n".join(modifiers), False],
        "Heroes": ["\n".join(towers[0]), False],
        "Primary": ["\n".join(towers[1]), True],
        "Military": ["\n".join(towers[2]), True],
        "": ["\n", False],
        "Magic": ["\n". join(towers[3]), True],
        "Support": ["\n".join(towers[4]), True],
        } 
     
    embed = filterembed(eventData, eventURL, title=f"{emoteid} Contested Territory #{eventIndex} - Tile {tileCode.upper()}")
    embed.set_image(url=EVENTURLS["Maps"][map])
    return embed, categorizedTiles 
