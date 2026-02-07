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

def filterModifiers(body: MetaBody, emojis: dict[str,  str]) -> list[str]:
    
    for modifier in body:
        
