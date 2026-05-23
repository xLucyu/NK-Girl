import { CTMetaData, MetaBody } from "@utils/types";

export interface Modifier {
  key: string;
  api: number | boolean;
  hasKey: boolean;
}

export function buildModifiers(body: MetaBody): Modifier[] {

  return [
    { key: "speedMultiplier", api: body._bloonModifiers.speedMultiplier, hasKey: true },
    { key: "moabSpeedMultiplier", api: body._bloonModifiers.moabSpeedMultiplier, hasKey: true },
    { key: "bossSpeedMultiplier", api: body._bloonModifiers.bossSpeedMultiplier, hasKey: true },
    { key: "regrowRateMultiplier", api: body._bloonModifiers.regrowRateMultiplier, hasKey: true },
    { key: "bloons", api: body._bloonModifiers.healthMultipliers.bloons, hasKey: true },
    { key: "moabs", api: body._bloonModifiers.healthMultipliers.moabs, hasKey: true },
    { key: "boss", api: body._bloonModifiers.healthMultipliers.boss, hasKey: true },
    { key: "disableMK", api: body.disableMK, hasKey: false },
    { key: "disableSelling", api: body.disableSelling, hasKey: false },
    { key: "abilityCooldownReductionMultiplier", api: body.abilityCooldownReductionMultiplier, hasKey: true },
    { key: "noContinues", api: body.noContinues, hasKey: false },
    { key: "maxTowers", api: body.maxTowers, hasKey: false },
    { key: "maxParagons", api: body.maxParagons, hasKey: false },
    { key: "leastCashUsed", api: body.leastCashUsed, hasKey: false },
    { key: "leastTiersUsed", api: body.leastTiersUsed, hasKey: false },
    { key: "disablePowers", api: body.disablePowers, hasKey: false },
    { key: "removeableCostMultiplier", api: body.removeableCostMultiplier, hasKey: true },
  ];
}

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
