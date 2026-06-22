import { Boss, bossHpValues } from "../assets";
import { BossDifficulty } from "../types";

interface BossTier {
    tier: number;
    totalHp: number;
    skullHp: number;
}

const playerMultiplier: Record<number, number> = {
    1: 1,
    2: 1.2,
    3: 1.4,
    4: 1.6
}

export function calcBossHp(
    boss: Boss, 
    hpModifier: number, 
    playerCount: number, 
    difficulty: BossDifficulty
): BossTier[] {

    const currentBoss = bossHpValues[difficulty][boss];
    const shieldMultiplier = currentBoss.Shield ?? 1;
    const skullCount = currentBoss.Skulls;

    return currentBoss.TierHP.map((baseHp, index) => {
        const totalHp = Math.round(baseHp * hpModifier * shieldMultiplier * playerMultiplier[playerCount]);
        const skullHp = Math.round(totalHp / skullCount);
        return {
            tier: index + 1,
            totalHp: totalHp,
            skullHp: skullHp
        }
    });
}
