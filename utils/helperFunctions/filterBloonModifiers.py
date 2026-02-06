from utils.assets import MODIFIERS 
from utils.dataclasses import MetaBody  

NOKEYS = [
    "MaxParagons", 
    "MaxTowers",
    "LeastTiers", 
    "LeastCash", 
    "MKDisabled", 
    "NoSelling", 
    "allCamo", 
    "allRegen",
    "NoContinues",
    "PowersDisabled"
]

MODIFIER_KEYS = [
    "speedMultiplier",
    "moabSpeedMultiplier",
    "bossSpeedMultiplier",
    "regrowRateMultiplier",
    "bloons",
    "moabs",
    "boss",
    "allCamo",
    "allRegen",
    "MKDisabled",
    "NoSelling",
    "AbilityCoolDown",
    "NoContinues",
    "MaxTowers",
    "MaxParagons",
    "LeastCash",
    "LeastTiers",
    "PowersDisabled",
    "RemoveableCost"
]


def filterModifiers(body: MetaBody, emojis: dict[str,  str]) -> list[str]:

    validModifiers = {
        modifier: value*100 if modifier not in NOKEYS else value 
        for modifier, value in vars(body).items() 
        if modifier in MODIFIER_KEYS
    }

    print(validModifiers)
