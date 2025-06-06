from dataclasses import asdict
from utils.assets.bloonsModifiers import MODIFIERS

NOKEYS = [
    "MaxParagons", 
    "MaxTowers",
    "LeastTiers", 
    "LeastCash", 
    "MKDisabled", 
    "NoSelling", 
    "allCamo", 
    "allRegrow"
]


def filterModifiers(modifiers: dict, emotes: dict) -> list[str]:

    flattenBloonModifiers = asdict(modifiers.pop("BloonModifiers"))
    flattenHealthModifiers = flattenBloonModifiers.pop("healthMultipliers")
    modifiers = {**flattenBloonModifiers, **flattenHealthModifiers, **modifiers}
    
    activeModifiers = {
        modifier: multiplier*100 if type(multiplier) == float else multiplier
        for modifier, multiplier in modifiers.items()
        if modifier not in NOKEYS and multiplier not in [9999, 1, -1]
        or modifier in NOKEYS and multiplier not in [9999, -1, False] 
    }
    
    formattedModifierList = []
    for modifier, multiplier in activeModifiers.items():
        embedDisplayName = MODIFIERS.get(modifier, "")
        emoteKey = "" if modifier in NOKEYS else "Increase" if multiplier > 100 else "Decrease"
        emoteId = emotes.get(f"{modifier}{emoteKey}")
        formattedEmote = f"<:{modifier}{emoteKey}:{emoteId}>" #<:bossIncrease:1335339243345809478> example 

        if modifier == "LeastCash":
            multiplier = f"%{multiplier:,}"
        elif isinstance(multiplier, bool): 
            multiplier = ""
        else:
            multiplier = int(multiplier)

        formattedModifierList.append(f"{formattedEmote} {multiplier}{embedDisplayName}")

    return formattedModifierList
