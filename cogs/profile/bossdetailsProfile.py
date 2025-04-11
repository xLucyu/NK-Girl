from api.fetchid import getID
from api.metadata import getBody
from api.emojis import getEmojis
from utils.assets.tierhp import bosshp
from utils.assets.urls import EVENTURLS
from utils.filter.embedfilter import filterembed 
from cogs.regex import splitNumbers

def getBossData(urls: dict):

    try:
        api = getID(urls, index=0) 

        if not api:
            return 

        metaData = api.get("MetaData", None)
        body = getBody(url=metaData)
        emojis = getEmojis()

        if not body or not emojis:
            return

        return api, body, emojis

    except:
        return None 
 

def tierfilter(bossHpMultiplier: int, bossIndex: dict, eventData: dict, players: int, emojis: dict) -> None:

    healthMultiplierMode = {
        1: 1,
        2: 1.20,
        3: 1.40,
        4: 1.60
    }
    
    shieldHpMultiplier = bossIndex.get("Shield", 1)
    skulls = bossIndex.get("Skulls", 1) 

    for tier, hp in enumerate(bossIndex["TierHP"], start=1):
        
        baseHp = hp * healthMultiplierMode[players] * bossHpMultiplier
        totalHp = baseHp * shieldHpMultiplier
        skullHp = round(totalHp / skulls)

        eventData[f"Tier {tier}"] = [
        f"""
        <:Lives:{emojis.get('Lives')}> TotalHP: {int(totalHp):,} HP
        <:Skull:{emojis.get('Skull')}> SkullHP: {int(skullHp):,} HP
        """, 
        False]


def bossdetailsProfile(players: int, difficulty: str):
    
    modes = [1, 2, 3, 4]
    players = modes[players]
        
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extension": f"metadata{difficulty.title()}"
    }
    
    api, body, emojis = getBossData(urls) #type: ignore
    apiData = api.get("Data", None)
    
    bossHpMultiplier = body["_bloonModifiers"]["healthMultipliers"]["boss"]
    name = apiData.get("bossType", None) 
    bossIndex = bosshp[difficulty][name.title()]
    bossemote = f"<:bossIncrease:{emojis.get('bossIncrease')}>" if bossHpMultiplier >= 1 else f"<:bossDecrease:{emojis.get('bossDecrease')}>"   

    eventData = {
        "Players": [players, False],
        "Skulls": [bossIndex["Skulls"], False],
        "Health Multiplier": [f"{bossemote} {int(bossHpMultiplier*100)}%", False]
    }
    
    tierfilter(bossHpMultiplier, bossIndex, eventData, players, emojis)

    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name.title()]
    bannerURL = EVENTURLS["Boss"][difficulty]["Banner"][name.title()]
    
    if difficulty == "standard":
        difficulty = "normal"

    eventNumber = splitNumbers(apiData.get("name", None)) 

    embed = filterembed(eventData, eventURL, title=f"{difficulty.title()} {eventNumber}")
    embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
    embed.set_image(url=bannerURL) 

    return embed, modes
