from utils.assets.bossTierHp import BOSSHP
from utils.assets.eventUrls import EVENTURLS
from utils.dataclasses.main import Body 
from utils.dataclasses.metaData import MetaData
from cogs.baseCommand import BaseCommand


def addBossTiers(bossHpMultiplier: int, bossIndex: dict, eventData: dict, players: int, emojis: dict) -> None:

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
    
    data = BaseCommand.getCurrentEventData(urls, index=0)
    eventMetaData = BaseCommand.useApiCall(data.get("MetaData", None))
    mainData = BaseCommand.transformDataToDataClass(Body, data.get("Data", None))
    metaData = BaseCommand.transformDataToDataClass(MetaData, eventMetaData)
    emotes = BaseCommand.getAllEmojis()

    bossHpMultiplier = metaData.body._bloonModifiers.healthMultipliers.boss
    bossName = mainData.bossType
 
    bossIndex = BOSSHP[difficulty][bossName.title()]
    bossemote = f"<:bossIncrease:{emotes.get('bossIncrease')}>" if bossHpMultiplier >= 1 else f"<:bossDecrease:{emotes.get('bossDecrease')}>"   

    eventData = {
        "Players": [players, False],
        "Skulls": [bossIndex["Skulls"], False],
        "Health Multiplier": [f"{bossemote} {int(bossHpMultiplier*100)}%", False]
    }
    
    addBossTiers(bossHpMultiplier, bossIndex, eventData, players, emotes)

    eventURL = EVENTURLS["Boss"][difficulty]["Image"][bossName.title()]
    bannerURL = EVENTURLS["Boss"][difficulty]["Banner"][bossName.title()]
    
    if difficulty == "standard":
        difficulty = "normal"

    eventNumber = BaseCommand.splitBossNames(mainData.name)

    embed = BaseCommand.createEmbed(eventData, eventURL, title=f"{difficulty.title()} {eventNumber}")
    embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
    embed.set_image(url=bannerURL) 

    return embed, modes
