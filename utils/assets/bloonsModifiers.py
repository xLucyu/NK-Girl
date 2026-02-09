from utils.dataclasses import MetaBody

def buildModifiers(body: MetaBody) -> dict[str, Modifier]:
  
    return {
        "speedMultiplier": Modifier(
            label="Bloon Speed", 
            api=body._bloonModifiers.speedMultiplier
        ),
        "moabSpeedMultiplier": Modifier(
            label="Moab Speed", 
            api=body._bloonModifiers.moabSpeedMultiplier
        ),
        "bossSpeedMultiplier": Modifier(
            label="Boss Speed", 
            api=body._bloonModifiers.bossSpeedMultiplier
        ),
        "regrowRateMultiplier": Modifier(
            label="Regrow Rate", 
            api=body._bloonModifiers.regrowRateMultiplier
        ),
        "bloons": Modifier(
            label="Ceramic Health", 
            api=body._bloonModifiers.healthMultipliers.bloons
        ),
        "moabs": Modifier(
            label="Moab Health", 
            api=body._bloonModifiers.healthMultipliers.moabs
        ),
        "boss": Modifier(
            label="Boss Health", 
            api=body._bloonModifiers.healthMultipliers.boss
        ),
        "disableMK": Modifier(
            label="MK Disabled", 
            api=body.disableMK
        ),
        "disableSelling": Modifier(
            label="No Selling", 
            api=body.disableSelling
        ),
        "abilityCooldownReductionMultiplier": Modifier(
            label="Ability Cooldown Rate",
            api=body.abilityCooldownReductionMultiplier
        ),
        "noContinues": Modifier(
            label="No Continues", 
            api=body.noContinues
        ),
        "maxTowers": Modifier(
            label="Tower Limit",
            api=body.maxTowers
        ),
        "maxParagons": Modifier(
            label="Paragon Limit",
            api=body.maxParagons
        ),
        "leastCashUsed": Modifier(
            label="Cash Limit", 
            api=body.leastCashUsed
        ),
        "leastTiersUsed": Modifier(
            label="Tiers Max", 
            api=body.leastTiersUsed
        ),
        "disablePowers": Modifier(
            label="No Powers",
            api=body.disablePowers
        ),
        "removeableCostMultiplier": Modifier(
            label="Removeable Cost", 
            api=body.removeableCostMultiplier
        ),
    }
