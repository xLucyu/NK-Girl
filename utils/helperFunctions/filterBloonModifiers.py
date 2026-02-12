from tpying import Union
from utils.dataclasses import (
    MetaBody, 
    Modifier,
    buildModifiers,
    DcModel
)


def filterModifiers(body: Union[MetaBody, DcModel], emojis: dict[str,  str], isCT: bool = False) -> list[str]:
    
    modifierDict: dict[str, Modifier] = buildModifiers(body) # to do, if mode is CT, use a different builder with DcModel
    
    return [
        (
            f"{mod.api} {mod.label}"
            if mod.label == "Cash Limit"
            else f"{int(mod.api * 100)}% {mod.label}"
            if mod.hasKey
            else f"{mod.api} {mod.label}"
        )
        for key, mod in modifierDict.items()
        if not (
            (mod.api is False)
            or mod.api in (1, -1, 9999)
            or (key == "maxParagons" and mod.api == 10)
            or (key == "maxTowers" and mod.api == 0)
        )
    ]
