from cogs.regex import removeNumbers
from api.fetchid import getID
from api.metadata import getBody 
from utils.assets.tierhp import bosshp
from utils.assets.urls import EVENTURLS
from utils.filter.embedfilter import filterembed 

def getBossData(urls):

    try:
        api = getID(url=urls.get("base"), index=0)

        if not api:
            return 
        
        ID = api.get("ID", None)
        body = getBody(url=f"{urls.get('base')}/{ID}/{urls.get('extensions')}")
        
        if not body:
            return

    except:
        return

    return api, body


def tierfilter(bossHpMultiplier: int, bossIndex: dict, eventData: dict, players: int) -> None:

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
        f"<:Lives:1337794403019915284> TotalHP: {int(totalHp):,} HP\n<:Skull:1337796956738814043> SkullHP: {int(skullHp):,} HP", 
        False]

def bossnumber(BossName):
    
    number = "".join([n for n in BossName if n.isdigit()])
    name = "".join([l for l in BossName if not l.isdigit()])
    return f"{name} #{number}"


def bossdetailsProfile(players, difficulty):
    
    modes = [1, 2, 3, 4]
    players = modes[players]
        
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/bosses",
        "extensions": f"metadata/{difficulty}"
    } 
    
    api, body = getBossData(urls) #type: ignore 
    
    if not body:
        return
    
    bossHpMultiplier = body["_bloonModifiers"]["healthMultipliers"]["boss"]
    name = removeNumbers(api.get("Name")) 
    bossIndex = bosshp[difficulty][name]
    bossemote = "<:bossIncrease:1335339243345809478>" if bossHpMultiplier >= 1 else "<:bossDecrease:1335339614080204873>"   

    eventData = {
        "Players": [players, False],
        "Skulls": [bossIndex["Skulls"], False],
        "Health Multiplier": [f"{bossemote} {int(bossHpMultiplier*100)}%", False]
    }
    
    tierfilter(bossHpMultiplier, bossIndex, eventData, players)

    eventURL = EVENTURLS["Boss"][difficulty]["Image"][name]
    bannerURL = EVENTURLS["Boss"][difficulty]["Banner"][name]
    
    if difficulty == "standard":
        difficulty = "normal"

    eventNumber = bossnumber(api.get("Name"))

    embed = filterembed(eventData, eventURL, title=f"{difficulty.title()} {eventNumber}")
    embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
    embed.set_image(url=bannerURL) 

    return embed, modes
