import type { BossDifficulty } from "@btd6/types";

export enum Boss {
  Bloonarius = "Bloonarius",
  Lych = "Lych",
  Vortex = "Vortex",
  Dreadbloon = "Dreadbloon",
  Phayze = "Phayze",
  Blastapopoulos = "Blastapopoulos",
  Diamondback = "Diamondback"
}

export interface BossValue {
  TierHP: number[];
  Skulls: number;
  Shield?: number;
}

export const BOSS_HP_VALUES: Record<BossDifficulty, Record<Boss, BossValue>> = {

 Standard: {
  Bloonarius: {
    TierHP: [20_000, 75_000, 350_000, 750_000, 3_000_000],
    Skulls: 4,
  },
  Lych: {
    TierHP: [14_000, 52_500, 220_000, 525_000, 2_100_000],
    Skulls: 6,
  },
  Vortex: {
    TierHP: [20_000, 62_800, 294_000, 628_000, 2_512_500],
    Skulls: 4,
  },
  Dreadbloon: {
    TierHP: [7_500, 25_000, 120_000, 260_000, 1_000_000],
    Skulls: 4,
    Shield: 0.5,
  },
  Phayze: {
    TierHP: [9_500, 35_000, 160_000, 350_000, 1_450_000],
    Skulls: 4,
    Shield: 0.25,
  },
  Blastapopoulos: {
    TierHP: [17_500, 65_000, 300_000, 650_000, 3_000_000],
    Skulls: 5,
  },
  Diamondback: {
    TierHP: [20_000, 95_000, 444_000, 900_000, 3_800_000],
    Skulls: 5
    }
  },
Elite: {
  Bloonarius: {
    TierHP: [50_000, 300_000, 2_000_000, 8_000_000, 40_000_000],
    Skulls: 8
  },
  Lych: {
    TierHP: [30_000, 180_000, 1_100_000, 4_800_000, 24_000_000],
    Skulls: 8
  },
  Vortex: {
    TierHP: [41_800, 251_000, 1_675_000, 6_700_000, 33_500_000],
    Skulls: 8,
  },
  Dreadbloon: {
    TierHP: [15_000, 90_000, 650_000, 2_625_000, 12_500_000],
    Skulls: 8,
    Shield: 0.35
  },
  Phayze: {
    TierHP: [19_000, 110_000, 770_000, 3_100_000, 15_500_000],
    Skulls: 6,
    Shield: 0.25
  },
  Blastapopoulos: {
    TierHP: [43_000, 270_000, 1_700_000, 7_000_000, 35_000_000],
    Skulls: 8,
  },
  Diamondback: {
    TierHP: [95_000, 550_000, 4_000_000, 0, 65_000_000],
    Skulls: 8
  }
}
};