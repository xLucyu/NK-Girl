from utils.assets import (
    BOSSHP,
    BOSS_IMAGE
)
from utils.helperFunctions import filterEmbed, splitNumbers
from api.eventContext import ProfileContext

healthMultiplierMode = {
    1: 1,
    2: 1.20,
    3: 1.40,
    4: 1.60
}

def addBossTiers(bossHpMultiplier: int, bossIndex: dict, eventData: dict, players: int, emojis: dict) -> None:
    
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


def bossdetailsProfile(profileContext: ProfileContext, playerCount: int, boss: str = "", multiplier: float = 0.0):
        
    difficulty = profileContext.difficulty
    emojis = profileContext.emojiData
    mainData = profileContext.mainData.selectedID

    if not boss:

        bossName = mainData.bossType
        bossHpMultiplier = profileContext.metaData.body._bloonModifiers.healthMultipliers.boss
        eventNumber = splitNumbers(mainData.name)

    else: 

        bossName = boss 
        multiplier = 1.0 if multiplier == 0.0 else multiplier
        eventNumber = boss

    bossIndex = BOSSHP[difficulty][bossName.title()]
    bossEmote = f"<:bossIncrease:{emojis.get('bossIncrease')}>" if bossHpMultiplier >= 1 else f"<:bossDecrease:{emojis.get('bossDecrease')}>"   

    eventData = {
        "Players": [playerCount, False],
        "Skulls": [bossIndex["Skulls"], False],
        "Health Multiplier": [f"{bossEmote} {int(bossHpMultiplier*100)}%", False]
    }
    
    addBossTiers(bossHpMultiplier, bossIndex, eventData, playerCount, emojis)

    eventURL = BOSS_IMAGE[difficulty]["Image"][bossName.title()]
    bannerURL = BOSS_IMAGE[difficulty]["Banner"][bossName.title()]
    
    if difficulty == "standard":
        difficulty = "normal" 

    embed = filterEmbed(eventData, eventURL, title=f"{difficulty.title()} {eventNumber}")
    embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
    embed.set_image(url=bannerURL) 

    previousEvents = [{
        "label": num,
        "value": num,
        "description": ""
    } for num in range(1, 5)]

    return {
        "Embed": embed,
        "PreviousEvents": previousEvents
    }
