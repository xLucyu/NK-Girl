import { Boss, bossHpValues } from "../assets";
import { BossDifficulty } from "../types";

export const playerMultiplier: Record<number, number> = {
  1: 1,
  2: 1.2,
  3: 1.4,
  4: 1.6
}

interface BossHealthData {
  skullCount: number;
  tiers: BossTier[];
}

interface BossTier {
  tier: number;
  baseHealth: number;
  withShield: number;
  totalHealth: number;
}

export function calcBossHp(
  boss: Boss, 
  hpModifier: number, 
  playerCount: number, 
  difficulty: BossDifficulty
): BossHealthData {

  const currentBoss = bossHpValues[difficulty][boss]
  const shieldMultiplier = currentBoss.Shield ?? 0;
  const skullCount = currentBoss.Skulls;

  const tiers = currentBoss.TierHP.map((base, index) => {
    const baseHealth = base * hpModifier * playerMultiplier[playerCount];
    const healthWithShield = Math.round(baseHealth * (skullCount * shieldMultiplier));
    const maxHealth = baseHealth + healthWithShield;
    const healthPerSkull = baseHealth / skullCount;
    const shieldPerSkull = healthWithShield / skullCount;

    return {
      tier: index + 1,
      baseHealth: healthPerSkull,
      withShield: shieldPerSkull,
      totalHealth: maxHealth,
    }
  });

  return {
    skullCount,
    tiers
  }
}
