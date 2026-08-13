import { CTMetaData, MetaBody } from "@utils";

export interface Modifier {
  label: string;
  api: number | boolean;
  hasKey: boolean;
  imageKey: (value: number | boolean) => string | null;
}

function increaseDecrease(increaseImage: string, decreaseImage: string) {

  return (value: number | boolean): string | null => {
    if (typeof value !== "number") return null;
    if (value === 1) return increaseImage;

    return value > 1 ? increaseImage : decreaseImage;
  };
}

export function buildModifiers(body: MetaBody, customRounds: boolean = false): Modifier[] {

  return [
    {
      label: "Boss Health",
      api: body._bloonModifiers.healthMultipliers.boss,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseHP", "BossDecreaseHP"),
    },
    {
      label: "Boss Speed",
      api: body._bloonModifiers.bossSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseSpeed", "BossDecreaseSpeed"),
    },
    {
      label: "MOAB Health",
      api: body._bloonModifiers.healthMultipliers.moabs,
      hasKey: true,
      imageKey: increaseDecrease("MoabBoost", "MoabDecreaseHP"),
    },
    {
      label: "MOAB Speed",
      api: body._bloonModifiers.moabSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterMoab", "SlowerMoab"),
    },
    {
      label: "Bloon Health",
      api: body._bloonModifiers.healthMultipliers.bloons,
      hasKey: true,
      imageKey: increaseDecrease("BloonBoost", "BloonDecreaseHP"),
    },
    {
      label: "Bloon Speed",
      api: body._bloonModifiers.speedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterBloons", "SlowerBloons"),
    },
    {
      label: "Regrow Rate",
      api: body._bloonModifiers.regrowRateMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RegrowRateIncrease", "RegrowRateDecrease"),
    },
    {
      label: "Ability Cooldown",
      api: body.abilityCooldownReductionMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("AbilityCooldownReductionIncreaseIcon", "AbilityCooldownReductionDecreaseIcon"),
    },
    {
      label: "Removable Cost",
      api: body.removeableCostMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RemovableCostIncrease", "RemovableCostDecrease"),
    },
    {
      label: "Tower Limit",
      api: body.maxTowers,
      hasKey: false,
      imageKey: () => "MaxTowers",
    },
    {
      label: "Paragon Limit",
      api: body.maxParagons,
      hasKey: false,
      imageKey: () => "Paragon",
    },
    {
      label: "Cash Limit",
      api: body.leastCashUsed,
      hasKey: false,
      imageKey: () => "LeastCash",
    },
    {
      label: "Tier Limit",
      api: body.leastTiersUsed,
      hasKey: false,
      imageKey: () => "LeastTiers",
    },
    {
      label: "Monkey Knowledge Disabled",
      api: body.disableMK,
      hasKey: false,
      imageKey: () => "NoKnowledge",
    },
    {
      label: "Selling Disabled",
      api: body.disableSelling,
      hasKey: false,
      imageKey: () => "SellingDisabled",
    },
    {
      label: "Powers Disabled",
      api: body.disablePowers,
      hasKey: false,
      imageKey: () => "PowersDisabled",
    },
    {
      label: "No Continues",
      api: body.noContinues,
      hasKey: false,
      imageKey: () => "NoContinues",
    },
    {
      label: "All Regen",
      api: body._bloonModifiers.allRegen,
      hasKey: false,
      imageKey: () => "AllRegen"
    },
    {
      label: "All Camo",
      api: body._bloonModifiers.allCamo,
      hasKey: false,
      imageKey: () => "AllCamo"
    },
    {
    label: "Custom Rounds",
    api: customRounds,
    hasKey: false,
    imageKey: () => "CustomRounds"
    }
  ];
}


export function buildCTModifiers(body: CTMetaData): Modifier[] {

  return [
    { 
      label: "Moab Health", 
      api: body.dcModel.bloonModifiers.healthMultipliers.moabs, 
      hasKey: true,
      imageKey: increaseDecrease("FasterMoab", "SlowerMoab"),
    },
    { 
      label: "Ceramic Health", 
      api: body.dcModel.bloonModifiers.healthMultipliers.bloons, 
      hasKey: true,
      imageKey: increaseDecrease("FasterBloons", "SlowerBloons"),
    },
    {
      label: "Bloon Speed",
      api: body.dcModel.bloonModifiers.speedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterBloons", "SlowerBloons"),
    },
    {
      label: "Regrow Rate",
      api: body.dcModel.bloonModifiers.regrowRateMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RegrowRateIncrease", "RegrowRateDecrease"),
    },
    {
      label: "Tower Limit",
      api: body.dcModel.maxTowers,
      hasKey: false,
      imageKey: () => "MaxTowers",
    },
    {
      label: "Monkey Knowledge Disabled",
      api: body.dcModel.disableMK,
      hasKey: false,
      imageKey: () => "NoKnowledge",
    },
    {
      label: "Selling Disabled",
      api: body.dcModel.disableSelling,
      hasKey: false,
      imageKey: () => "SellingDisabled",
    }
  ];
}

export function filterModifiers(modifiers: Modifier[]) {
    
    return modifiers.filter((modifier) => {
        
        const value = modifier.api;

        if (typeof value === "boolean") return value === true;
        if (modifier.hasKey) return value !== 1 && value !== -1 && value !== 9999;
        if (modifier.label === "Paragon Limit") return value !== 10;
        if (modifier.label === "Tower Limit") return value !== 0 && value !== 9999;

        return value !== -1 && value !== 9999 && value !== 0;
    });
}
