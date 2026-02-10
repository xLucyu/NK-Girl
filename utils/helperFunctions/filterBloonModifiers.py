from utils.dataclasses import (
    MetaBody, 
    Modifier,
    buildModifiers 
)

def filterModifiers(body: MetaBody, emojis: dict[str,  str], isCT: bool = False) -> list[str]:
    
    modifierDict: dict[str, Modifier] = buildModifiers(body)
    
    activeModifiers = []

    for key, modifier in modifierDict.items():

        if key == "maxTowers" and modifier.api != 0:
            activeModifiers.append(f"{modifier.api} {modifier.label}")

        elif key == "maxParagons" and modifier.api != 10:
            activeModifiers.append(f"{modifier.api} {modifier.label}")

        elif key == "LeastCashUsed":
            activeModifiers.append(f"${modifier.api} {modifier.label}")
            
        elif modifier.hasKey and modifier.api not in [-1, 0, 9999, False]:

            modifier.api *= 100
            activeModifiers.append(f"{modifier.api} {modifier.label}")
            
        else:
            activeModifiers.append(f"{modifier.api} {modifier.label}")

    return activeModifiers

