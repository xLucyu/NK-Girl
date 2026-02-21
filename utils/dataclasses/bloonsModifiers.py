from utils.dataclasses.metaData import MetaBody
from dataclasses import dataclass 
from typing import Union 


@dataclass(slots=True) 
class Modifier:
    label: str 
    api: Union[float, int, bool]
    hasKey: bool 


def buildModifiers(body: MetaBody) -> dict[str, Modifier]:
    
    return {
        "speedMultiplier": Modifier(
            label="Bloon Speed",
            api=body._bloonModifiers.speedMultiplier,
            hasKey=True
        ),
        "moabSpeedMultiplier": Modifier(
            label="Moab Speed",
            api=body._bloonModifiers.moabSpeedMultiplier,
            hasKey=True
        ),
        "bossSpeedMultiplier": Modifier(
            label="Boss Speed",
            api=body._bloonModifiers.bossSpeedMultiplier,
            hasKey=True
        ),
        "regrowRateMultiplier": Modifier(
            label="Regrow Rate",
            api=body._bloonModifiers.regrowRateMultiplier,
            hasKey=True
        ),
        "bloons": Modifier(
            label="Ceramic Health",
            api=body._bloonModifiers.healthMultipliers.bloons,
            hasKey=True
        ),
        "moabs": Modifier(
            label="Moab Health",
            api=body._bloonModifiers.healthMultipliers.moabs,
            hasKey=True
        ),
        "boss": Modifier(
            label="Boss Health",
            api=body._bloonModifiers.healthMultipliers.boss,
            hasKey=True
        ),
        "disableMK": Modifier(
            label="MK Disabled",
            api=body.disableMK,
            hasKey=False
        ),
        "disableSelling": Modifier(
            label="No Selling",
            api=body.disableSelling,
            hasKey=False
        ),
        "abilityCooldownReductionMultiplier": Modifier(
            label="Ability Cooldown Rate",
            api=body.abilityCooldownReductionMultiplier,
            hasKey=True
        ),
        "noContinues": Modifier(
            label="No Continues",
            api=body.noContinues,
            hasKey=False
        ),
        "maxTowers": Modifier(
            label="Tower Limit",
            api=body.maxTowers,
            hasKey=False
        ),
        "maxParagons": Modifier(
            label="Paragon Limit",
            api=body.maxParagons,
            hasKey=False
        ),
        "leastCashUsed": Modifier(
            label="Cash Limit",
            api=body.leastCashUsed,
            hasKey=False
        ),
        "leastTiersUsed": Modifier(
            label="Tiers Max",
            api=body.leastTiersUsed,
            hasKey=False
        ),
        "disablePowers": Modifier(
            label="No Powers",
            api=body.disablePowers,
            hasKey=False
        ),
        "removeableCostMultiplier": Modifier(
            label="Removeable Cost",
            api=body.removeableCostMultiplier,
            hasKey=True
        ),
    }

