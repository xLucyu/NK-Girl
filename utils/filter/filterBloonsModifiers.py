from dataclasses import is_dataclass, asdict
from utils.assets.bloonsModifiers import MODIFIERS

NOKEYS = ["MaxParagons", "MaxTowers", "LeastTiers"]


def modifierEmoteFilter(activeModifiers: dict, emotes: dict) -> list: 
    modifierEmotes = list()
 
    for modifier, multiplier in activeModifiers.items():
        key = "" if modifier in NOKEYS or multiplier is True else "Increase" if multiplier > 100 else "Decrease"
        
        modifierName = f"{modifier}{key}"
        emoteId = emotes.get(modifierName, None)
        embedDisplayName = MODIFIERS.get(modifier)

        if multiplier is True:
            value = ""
        elif modifier == "LeastCash":
            value = f"${multiplier:,} "
        elif key == "":
            value = f"{multiplier} "
        else:
            value = f"{multiplier}% "

        modifierEmotes.append(f"<:{modifierName}:{emoteId}> {value}{embedDisplayName}")

    return modifierEmotes
        

def handleModifiers(modifiers: dict) -> dict:

    activeModifiers = dict() 

    for modifier, multiplier in modifiers.items(): # needed to unpack dataclasses
        if is_dataclass(multiplier):
            multiplier = asdict(multiplier)
            activeModifiers.update(handleModifiers(multiplier))
            continue
       
        match multiplier:
            case True:
               activeModifiers[modifier] = True

            case dict():
                activeModifiers.update(handleModifiers(multiplier))

            case int() | float():
                if modifier not in NOKEYS:
                    if multiplier in [1, -1, False, 9999]: # filtering out all percentage based categories
                        continue 

                if multiplier <= 0 and modifier != "MaxParagons" or multiplier == 9999:
                    continue 

                if modifier == "MaxParagons" and multiplier > 9:
                    continue 

                value = (multiplier if modifier in NOKEYS else int(multiplier*100)) 
                activeModifiers[modifier] = value

    return activeModifiers
                

def filterModifiers(modifiers: dict, emotes: dict) -> list:
     
    activeModifiers = handleModifiers(modifiers) 
    return modifierEmoteFilter(activeModifiers, emotes)
