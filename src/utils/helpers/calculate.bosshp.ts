import { Boss, bossHpValues,  } from "../assets";
import { BossDifficulty } from "../types";

export const playerMultiplier: Record<number, number> = {
  1: 1,
  2: 1.2,
  3: 1.4,
  4: 1.6
}

interface BossTier {
  tier: number;
  totalHp: string;
  skullHp: string;
}

export function calcBossHp(
  boss: Boss, 
  hpModifier: number, 
  playerCount: number, 
  difficulty: BossDifficulty
): BossTier[] {

  const currentBoss = bossHpValues[difficulty][boss];
  const shieldMultiplier = currentBoss?.Shield ?? 0;
  const skullCount = currentBoss?.Skulls;

  return currentBoss.TierHP.map((baseHp, index) => {
    const totalHp = baseHp + skullCount * (baseHp * shieldMultiplier)
    const baseHpPerSkull = Math.round((baseHp / skullCount) * hpModifier * playerMultiplier[playerCount]);
    const skullHp = Math.round(totalHp / skullCount);
    return {
      tier: index + 1,
      totalHp: totalHp.toLocaleString("en-US"),
      baseHpPerSkull,
      skullHp: skullHp.toLocaleString("en-US")
    }
  });
}
