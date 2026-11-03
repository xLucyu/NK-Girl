import { ModifierImages } from "@btd6/assets";
import { CTMetaData, MetaBody } from "@btd6/types";

type ModifierImage = (typeof ModifierImages)[keyof typeof ModifierImages];
type Value = number | boolean;

interface ModifierDefinition<T> {
  label: string;
  get: (value: T) => Value;
  image: ModifierImage | readonly [increase: ModifierImage, decrease: ModifierImage];
  off?: readonly number[];
}

export interface Modifier {
  label: string;
  value: Value;
  image: ModifierImage;
}

const MULT_OFF = [1, -1, 9999] as const;
const LIMT_OFF = [0, -1, 9999] as const;

const EVENT_MODIFIERS = {
  BossHealth: {
    label: "Boss Health",
    get: (b) => b._bloonModifiers.healthMultipliers.boss,
    off: MULT_OFF,
    image: [ModifierImages.BossHealthIncrease, ModifierImages.BossHealthDecrease],
  },
  BossSpeed: {
    label: "Boss Speed",
    get: (b) => b._bloonModifiers.bossSpeedMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.BossSpeedIncrease, ModifierImages.BossSpeedDecrease],
  },
  MoabHealth: {
    label: "MOAB Health",
    get: (b) => b._bloonModifiers.healthMultipliers.moabs,
    off: MULT_OFF,
    image: [ModifierImages.MoabHealthIncrease, ModifierImages.MoabHealthDecrease],
  },
  MoabSpeed: {
    label: "MOAB Speed",
    get: (b) => b._bloonModifiers.moabSpeedMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.MoabSpeedIncrease, ModifierImages.MoabSpeedDecrease],
  },
  CeramicHealth: {
    label: "Ceramic Health",
    get: (b) => b._bloonModifiers.healthMultipliers.bloons,
    off: MULT_OFF,
    image: [ModifierImages.CeramicHealthIncrease, ModifierImages.CeramicHealthDecrease],
  },
  BloonSpeed: {
    label: "Bloon Speed",
    get: (b) => b._bloonModifiers.speedMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.BloonsSpeedIncrease, ModifierImages.BloonsSpeedDecrease],
  },
  RegrowRate: {
    label: "Regrow Rate",
    get: (b) => b._bloonModifiers.regrowRateMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.RegrowRateIncrease, ModifierImages.RegrowRateDecrease],
  },
  AbilityCooldown: {
    label: "Ability Cooldown",
    get: (b) => b.abilityCooldownReductionMultiplier,
    off: MULT_OFF,
    image: [
      ModifierImages.AbilityCooldownReductionIncrease,
      ModifierImages.AbilityCooldownReductionDecrease,
    ],
  },
  RemovableCost: {
    label: "Removable Cost",
    get: (b) => b.removeableCostMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.RemovableCostIncrease, ModifierImages.RemovableCostDecrease],
  },
  TowerLimit: {
    label: "Tower Limit",
    get: (b) => b.maxTowers,
    image: ModifierImages.MaxTowers,
  },
  ParagonLimit: {
    label: "Paragon Limit",
    get: (b) => b.maxParagons,
    off: [10, -1, 9999],
    image: ModifierImages.Paragon,
  },
  CashLimit: {
    label: "Cash Limit",
    get: (b) => b.leastCashUsed,
    image: ModifierImages.LeastCash,
  },
  TierLimit: {
    label: "Tier Limit",
    get: (b) => b.leastTiersUsed,
    image: ModifierImages.LeastTiers,
  },
  NoMK: {
    label: "Monkey Knowledge Disabled",
    get: (b) => b.disableMK,
    image: ModifierImages.NoKnowledge,
  },
  NoSelling: {
    label: "Selling Disabled",
    get: (b) => b.disableSelling,
    image: ModifierImages.SellingDisabled,
  },
  NoPowers: {
    label: "Powers Disabled",
    get: (b) => b.disablePowers,
    image: ModifierImages.PowersDisabled,
  },
  NoContinues: {
    label: "No Continues",
    get: (b) => b.noContinues,
    image: ModifierImages.NoContinues,
  },
  AllRegen: {
    label: "All Regen",
    get: (b) => b._bloonModifiers.allRegen,
    image: ModifierImages.AllRegen,
  },
  AllCamo: {
    label: "All Camo",
    get: (b) => b._bloonModifiers.allCamo,
    image: ModifierImages.AllCamo,
  },
} satisfies Record<string, ModifierDefinition<MetaBody>>;

const CT_MODIFIERS = {
  MoabHealth: {
    label: "MOAB Health",
    get: (c) => c.dcModel.bloonModifiers.healthMultipliers.moabs,
    off: MULT_OFF,
    image: [ModifierImages.MoabHealthIncrease, ModifierImages.MoabHealthDecrease],
  },
  CeramicHealth: {
    label: "Ceramic Health",
    get: (c) => c.dcModel.bloonModifiers.healthMultipliers.bloons,
    off: MULT_OFF,
    image: [ModifierImages.CeramicHealthIncrease, ModifierImages.CeramicHealthDecrease],
  },
  BloonSpeed: {
    label: "Bloon Speed",
    get: (c) => c.dcModel.bloonModifiers.speedMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.BloonsSpeedIncrease, ModifierImages.BloonsSpeedDecrease],
  },
  RegrowRate: {
    label: "Regrow Rate",
    get: (c) => c.dcModel.bloonModifiers.regrowRateMultiplier,
    off: MULT_OFF,
    image: [ModifierImages.RegrowRateIncrease, ModifierImages.RegrowRateDecrease],
  },
  TowerLimit: {
    label: "Tower Limit",
    get: (c) => c.dcModel.maxTowers,
    image: ModifierImages.MaxTowers,
  },
  NoMK: {
    label: "Monkey Knowledge Disabled",
    get: (c) => c.dcModel.disableMK,
    image: ModifierImages.NoKnowledge,
  },
  NoSelling: {
    label: "Selling Disabled",
    get: (c) => c.dcModel.disableSelling,
    image: ModifierImages.SellingDisabled,
  },
} satisfies Record<string, ModifierDefinition<CTMetaData>>;

export type MetaModifierKey = keyof typeof EVENT_MODIFIERS;
export type CTModifierKey = keyof typeof CT_MODIFIERS;

function resolve<T>(definitions: Record<string, ModifierDefinition<T>>, source: T): Modifier[] {

  return Object.values(definitions).flatMap(({ label, get, image, off = LIMT_OFF }) => {
    const value = get(source);
    const isActive = typeof value === "boolean" ? value : !off.includes(value);
    if (!isActive) return [];

    const img = Array.isArray(image) ? (value as number > 1 ? image[0] : image[1]) : image;
    return [{ label, value, image: img as ModifierImage}];
  });
}

export function buildModifiers(body: MetaBody, customRounds: boolean = false): Modifier[] {
  const active = resolve(EVENT_MODIFIERS, body);
  if (customRounds) active.push({ label: "Custom Rounds", value: true, image: ModifierImages.CustomRounds });
  return active;
}

export function buildCTModifiers(body: CTMetaData): Modifier[] {
  return resolve(CT_MODIFIERS, body);
}
