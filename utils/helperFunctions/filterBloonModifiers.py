from utils.dataclasses import (
    MetaBody, 
    Modifier,
    buildModifiers 
)

def filterModifiers(body: MetaBody, emojis: dict[str,  str], isCT: bool = False) -> list[str]:
    
    modifierDict: dict[str, Modifier] = buildModifiers(body)
    
    activeModifiers = {
        key: mod.api
        for key, mod in modifierDict.items()
        if not (
            (mod.api is False and isinstance(mod.api, bool))
            or mod.api in [1, -1, 9999]
            or (key == "maxParagons" and mod == 10)
            or (key == "maxTowers" and mod == 0)
        )
    }

