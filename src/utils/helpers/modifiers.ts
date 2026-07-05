import { CTMetaData, MetaBody } from "@utils";

export interface Modifier {
  key: string;
  api: number | boolean;
  hasKey: boolean;
  imageKey: (value: number | boolean) => string | null;
}

function increaseDecrease(
  increaseImage: string,
  decreaseImage: string
) {
  return (value: number | boolean): string | null => {
    if (typeof value !== "number") return null;
    if (value === 1) return null;

    return value > 1 ? increaseImage : decreaseImage;
  };
}

export function buildModifiers(body: MetaBody): Modifier[] {
  return [
    {
      key: "speedMultiplier",
      api: body._bloonModifiers.speedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterBloons", "SlowerBloons"),
    },
    {
      key: "moabSpeedMultiplier",
      api: body._bloonModifiers.moabSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("FasterMoab", "SlowerMoab"),
    },
    {
      key: "bossSpeedMultiplier",
      api: body._bloonModifiers.bossSpeedMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseSpeed", "BossDecreaseSpeed"),
    },
    {
      key: "regrowRateMultiplier",
      api: body._bloonModifiers.regrowRateMultiplier,
      hasKey: true,
      imageKey: increaseDecrease("RegrowRateIncrease", "RegrowRateDecrease"),
    },
    {
      key: "bloons",
      api: body._bloonModifiers.healthMultipliers.bloons,
      hasKey: true,
      imageKey: increaseDecrease("BloonBoost", "BloonDecreaseHP"),
    },
    {
      key: "moabs",
      api: body._bloonModifiers.healthMultipliers.moabs,
      hasKey: true,
      imageKey: increaseDecrease("MoabBoost", "MoabDecreaseHP"),
    },
    {
      key: "boss",
      api: body._bloonModifiers.healthMultipliers.boss,
      hasKey: true,
      imageKey: increaseDecrease("BossIncreaseHP", "BossDecreaseHP"),
    },
    {
      key: "disableMK",
      api: body.disableMK,
      hasKey: false,
      imageKey: () => "NoKnowledge",
    },
    {
      key: "disableSelling",
      api: body.disableSelling,
      hasKey: false,
      imageKey: () => "SellingDisabled",
    },
    {
      key: "abilityCooldownReductionMultiplier",
      api: body.abilityCooldownReductionMultiplier,
      hasKey: true,
      imageKey: () => "AbilityCooldownReductionMultiplier",
    },
    {
      key: "noContinues",
      api: body.noContinues,
      hasKey: false,
      imageKey: () => "NoContinues",
    },
    {
      key: "maxTowers",
      api: body.maxTowers,
      hasKey: false,
      imageKey: () => "MaxTowers",
    },
    {
      key: "maxParagons",
      api: body.maxParagons,
      hasKey: false,
      imageKey: () => "Paragon",
    },
    {
      key: "leastCashUsed",
      api: body.leastCashUsed,
      hasKey: false,
      imageKey: () => "LeastCash",
    },
    {
      key: "leastTiersUsed",
      api: body.leastTiersUsed,
      hasKey: false,
      imageKey: () => "LeastTiers",
    },
    {
      key: "disablePowers",
      api: body.disablePowers,
      hasKey: false,
      imageKey: () => "PowersDisabled",
    },
    {
      key: "removeableCostMultiplier",
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
        if (modifier.key === "maxParagons" && value === 10) return false;
        if (modifier.key === "maxTowers" && value === 0) return false;

        return value !== -1 && value !== 9999 && value !== 0;
    });
}
