from utils.dataclasses import (
    MetaBody, 
    Modifier,
    buildModifiers 
)

def filterModifiers(body: MetaBody, emojis: dict[str,  str], isCT: bool = False) -> list[str]:
    
    modifierDict: dict[str, Modifier] = buildModifiers(body)
    
    return {
    (
        f"${mod.label}" 
        if mod.label == "Cash Limit"
        else mod.label
    ):
    (
        f"{int(mod.api * 100)}%"
        if mod.hasKey
        else mod.api
    )
    for key, mod in modifierDict.items()
    if not (
        (mod.api is False)
        or mod.api in (1, -1, 9999)
        or (key == "maxParagons" and mod.api == 10)
        or (key == "maxTowers" and mod.api == 0)
    )
}

