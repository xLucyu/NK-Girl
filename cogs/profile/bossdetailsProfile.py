from cogs.regex import removeNumbers
from api.fetchid import getID
from api.metadata import getBody
from api.emojis import getEmojis
from utils.assets.tierhp import bosshp
from utils.assets.urls import EVENTURLS
from utils.filter.embedfilter import filterembed 
from cogs.regex import splitNumbers

def getBossData(urls):

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
        return 
 

def tierfilter(bossHpMultiplier: int, bossIndex: dict, eventData: dict, players: int, emojis: dict) -> None:

    healthMultiplierMode = {
        1: 1,
        2: 1.20,
        3: 1.40,
        4: 1.60
    }
    
    shieldHpMultiplier = bossIndex.get("Shield", 1)
    skullMultiplier = (bossIndex.get("Skulls") if shieldHpMultiplier != 1 else 1) # 1 skull if boss has no shield

    for tier, hp in enumerate(bossIndex["TierHP"]):
        
        baseHp = hp * healthMultiplierMode[players] * bossHpMultiplier 
        totalHp = round(baseHp * shieldHpMultiplier * skullMultiplier)
        skullHp = round(totalHp / bossIndex["Skulls"], 2)
        eventData[f"Tier {tier+1}"] = [
        f"""
        <:Lives:{emojis.get('Lives')}> TotalHP: {int(totalHp):,}
        HP\n<:Skull:{emojis.get('Skull')}> SkullHP: {int(skullHp):,} HP
        """, 
        False]


def bossdetailsProfile(players, difficulty):
    
    modes = [1, 2, 3, 4]
    players = modes[players]
        
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extension": f"metadata{difficulty.title()}"
    }
    
    api, body, emojis = getBossData(urls) #type: ignore 
    
    if not body:
        return
    
    bossHpMultiplier = body["_bloonModifiers"]["healthMultipliers"]["boss"]
    name = removeNumbers(api.get("Name")) 
    bossIndex = bosshp[difficulty][name]
    bossemote = f"<:bossIncrease:{emojis.get('bossIncrease')}>" if bossHpMultiplier >= 1 else f"<:bossDecrease:{emojis.get('bossDecrease')}>"   

    eventData = {
        "Players": [players, False],
        "Skulls": [bossIndex["Skulls"], False],
        "Health Multiplier": [f"{bossemote} {int(bossHpMultiplier*100)}%", False]
    }
    
    tierfilter(bossHpMultiplier, bossIndex, eventData, players, emojis)

    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name]
    bannerURL = EVENTURLS["Boss"][difficulty]["Banner"][name]
    
    if difficulty == "standard":
        difficulty = "normal"

    eventNumber = splitNumbers(api.get("Name")) 

    embed = filterembed(eventData, eventURL, title=f"{difficulty.title()} {eventNumber}")
    embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
    embed.set_image(url=bannerURL) 

    return embed, modes
