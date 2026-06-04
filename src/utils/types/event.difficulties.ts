export const BossDifficulties = ["Standard", "Elite"] as const;
export type BossDifficulty = typeof BossDifficulties[number];

export const OdysseyDifficulties = ["Easy", "Medium", "Hard"] as const;
export type OdysseyDifficulty = typeof OdysseyDifficulties[number];
