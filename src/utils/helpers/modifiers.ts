import { CTMetaData, MetaBody } from "@utils";

export interface Modifier {
  key: string;
  api: number | boolean;
  hasKey: boolean;
  imageKey: (value: number) => string | null;
}

export function buildModifiers(body: MetaBody): Modifier[] {
  return [
    { key: "speedMultiplier", api: body._bloonModifiers.speedMultiplier, hasKey: true,
      imageKey: (value) => value > 1 ? "FasterBloons" : "SlowerBloons" },
    { key: "moabSpeedMultiplier", api: body._bloonModifiers.moabSpeedMultiplier, hasKey: true,
      imageKey: (value) => value > 1 ? "FasterMoab" : "SlowerMoab" },
    { key: "bossSpeedMultiplier", api: body._bloonModifiers.bossSpeedMultiplier, hasKey: true,
      imageKey: (value) => value > 1 ? "BossIncreaseSpeed" : "BossDecreaseSpeed" },
    { key: "regrowRateMultiplier", api: body._bloonModifiers.regrowRateMultiplier, hasKey: true,
      imageKey: (value) => value > 1 ? "RegrowRateIncrease" : "RegrowRateDecrease" },
    { key: "bloons", api: body._bloonModifiers.healthMultipliers.bloons, hasKey: true,
      imageKey: (value) => value > 1 ? "BloonBoost" : "BloonDecreaseHP" },
    { key: "moabs", api: body._bloonModifiers.healthMultipliers.moabs, hasKey: true,
      imageKey: (value) => value > 1 ? "MoabBoost" : "MoabDecreaseHP" },
    { key: "boss", api: body._bloonModifiers.healthMultipliers.boss, hasKey: true,
      imageKey: (value) => value > 1 ? "BossIncreaseHP" : "BossDecreaseHP" },
    { key: "disableMK", api: body.disableMK, hasKey: false,
      imageKey: () => "NoKnowledge" },
    { key: "disableSelling", api: body.disableSelling, hasKey: false,
      imageKey: () => "SellingDisabled" },
    { key: "abilityCooldownReductionMultiplier", api: body.abilityCooldownReductionMultiplier, hasKey: true,
      imageKey: () => "AbilityCooldownReductionMultiplier" },
    { key: "noContinues", api: body.noContinues, hasKey: false,
      imageKey: () => "NoContinues" },
    { key: "maxTowers", api: body.maxTowers, hasKey: false,
      imageKey: () => "MaxTowers" },
    { key: "maxParagons", api: body.maxParagons, hasKey: false,
      imageKey: () => "Paragon" },
    { key: "leastCashUsed", api: body.leastCashUsed, hasKey: false,
      imageKey: () => "LeastCash" },
    { key: "leastTiersUsed", api: body.leastTiersUsed, hasKey: false,
      imageKey: () => "LeastTiers" },
    { key: "disablePowers", api: body.disablePowers, hasKey: false,
      imageKey: () => "PowersDisabled" },
    { key: "removeableCostMultiplier", api: body.removeableCostMultiplier, hasKey: true,
      imageKey: (value) => value > 1 ? "RemovableCostIncrease" : "RemovableCostDecrease" },
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
