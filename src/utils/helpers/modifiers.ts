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
    if (value === 1) return null;

    return value > 1 ? increaseImage : decreaseImage;
  };
}

export function buildModifiers(body: MetaBody): Modifier[] {

  return [
    {
      label: "Bloon Speed",
      api: body._bloonModifiers.speedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterBloons", "SlowerBloons"),
    },
    {
      label: "MOAB Speed",
      api: body._bloonModifiers.moabSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterMoab", "SlowerMoab"),
    },
    {
      label: "Boss Speed",
      api: body._bloonModifiers.bossSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseSpeed", "BossDecreaseSpeed"),
    },
    {
      label: "Regrow Rate",
      api: body._bloonModifiers.regrowRateMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RegrowRateIncrease", "RegrowRateDecrease"),
    },
    {
      label: "Bloon Health",
      api: body._bloonModifiers.healthMultipliers.bloons,
      hasKey: true,
      imageKey: increaseDecrease("BloonBoost", "BloonDecreaseHP"),
    },
    {
      label: "MOAB Health",
      api: body._bloonModifiers.healthMultipliers.moabs,
      hasKey: true,
      imageKey: increaseDecrease("MoabBoost", "MoabDecreaseHP"),
    },
    {
      label: "Boss Health",
      api: body._bloonModifiers.healthMultipliers.boss,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseHP", "BossDecreaseHP"),
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
      label: "Ability Cooldown",
      api: body.abilityCooldownReductionMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("AbilityCooldownReductionIncreaseIcon", "AbilityCooldownReductionDecreaseIcon"),
    },
    {
      label: "No Continues",
      api: body.noContinues,
      hasKey: false,
      imageKey: () => "NoContinues",
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
      label: "Powers Disabled",
      api: body.disablePowers,
      hasKey: false,
      imageKey: () => "PowersDisabled",
    },
    {
      label: "Removable Cost",
      api: body.removeableCostMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RemovableCostIncrease", "RemovableCostDecrease"),
    },
  ];
}


/*
export function buildCTModifiers(body: CTMetaData): Modifier[] {

  return [
    { key: "bloons", api: body.dcModel.bloonModifiers.healthMultipliers.bloons, hasKey: true },
    { key: "moabs", api: body.dcModel.bloonModifiers.healthMultipliers.moabs, hasKey: true },
    { key: "regrowRateMultiplier", api: body.dcModel.bloonModifiers.regrowRateMultiplier, hasKey: true },
    { key: "speedMultiplier", api: body.dcModel.bloonModifiers.speedMultiplier, hasKey: true },
    { key: "disableMK", api: body.dcModel.disableMK, hasKey: false },
    { key: "disableSelling", api: body.dcModel.disableSelling, hasKey: false },
    { key: "maxTowers", api: body.dcModel.maxTowers, hasKey: false },
  ];
}
*/

export function filterModifiers(modifiers: Modifier[]) {
    
    return modifiers.filter((modifier) => {
        
        const value = modifier.api;

        if (typeof value === "boolean") return value === true;
        if (modifier.hasKey) return value !== 1 && value !== -1 && value !== 9999;
        if (modifier.label === "Paragon Limit" && value === 10) return false;
        if (modifier.label === "Tower Limit" && value === 0) return false;

        return value !== -1 && value !== 9999 && value !== 0;
    });
}
