export type MedalsMode = "Race" | "Standard" | "Elite" | "CTplayer" | "CTteam";

export type MedalEntry = {
  min: number;
  max: number;
  medal: string;
};

export const MEDALS: Record<MedalsMode, MedalEntry[]> = {
    
  Race: [
    { min: 1, max: 1, medal: "RaceFirst" },
    { min: 2, max: 2, medal: "RaceSecond" },
    { min: 3, max: 3, medal: "RaceThird" },
    { min: 4, max: 50, medal: "RaceT50" },
    { min: 51, max: 100, medal: "RaceT100" },
    { min: 0.00, max: 0.10, medal: "RaceT10Perc" },
    { min: 0.10, max: 0.25, medal: "RaceT25Perc" },
    { min: 0.25, max: 0.50, medal: "RaceT50Perc" },
    { min: 0.50, max: 0.75, medal: "RaceT75Perc" },
    { min: 0.75, max: 1.0, medal: "Participant" }
  ],

  Standard: [
    { min: 1, max: 1, medal: "BossFirst" },
    { min: 2, max: 2, medal: "BossSecond" },
    { min: 3, max: 3, medal: "BossThird" },
    { min: 4, max: 50, medal: "BossT50" },
    { min: 51, max: 100, medal: "BossT100" },
    { min: 0.00, max: 0.10, medal: "BossT10Perc" },
    { min: 0.10, max: 0.25, medal: "BossT25Perc" },
    { min: 0.25, max: 0.50, medal: "BossT50Perc" },
    { min: 0.50, max: 0.75, medal: "BossT75Perc" },
    { min: 0.75, max: 1.0, medal: "Participant" }
  ],

  Elite: [
    { min: 1, max: 1, medal: "BossEFirst" },
    { min: 2, max: 2, medal: "BossESecond" },
    { min: 3, max: 3, medal: "BossEThird" },
    { min: 4, max: 50, medal: "BossET50" },
    { min: 51, max: 100, medal: "BossET100" },
    { min: 0.00, max: 0.10, medal: "BossET10Perc" },
    { min: 0.10, max: 0.25, medal: "BossET25Perc" },
    { min: 0.25, max: 0.50, medal: "BossET50Perc" },
    { min: 0.50, max: 0.75, medal: "BossET75Perc" },
    { min: 0.75, max: 1.0, medal: "Participant" }
  ],

  CTplayer: [
    { min: 1, max: 25, medal: "CTPT25" },
    { min: 26, max: 100, medal: "CTPT100" },
    { min: 0.00, max: 0.01, medal: "CTPT1Perc" },
    { min: 0.01, max: 0.10, medal: "CTPT10Perc" },
    { min: 0.10, max: 0.25, medal: "CTPT25Perc" },
    { min: 0.25, max: 0.50, medal: "CTPT50Perc" },
    { min: 0.50, max: 0.75, medal: "CTPT75Perc" },
    { min: 0.75, max: 1.0, medal: "Participant" }
  ],

  CTteam: [
    { min: 1, max: 1, medal: "CTTFirst" },
    { min: 2, max: 2, medal: "CTTSecond" },
    { min: 3, max: 3, medal: "CTTThird" },
    { min: 4, max: 25, medal: "CTTT25" },
    { min: 26, max: 100, medal: "CTTT100" },
    { min: 0.00, max: 0.01, medal: "CTTT1Perc" },
    { min: 0.01, max: 0.10, medal: "CTTT10Perc" },
    { min: 0.10, max: 0.25, medal: "CTTT25Perc" },
    { min: 0.25, max: 0.75, medal: "CTTT75Perc" },
    { min: 0.75, max: 1.0, medal: "Participant" }
  ]
};
