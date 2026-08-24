import { MedalImages } from "@btd6/assets";

export type MedalsMode = "Race" | "Standard" | "Elite" | "Player" | "Team";

export type MedalEntry = {
  min: number;
  max: number;
  medal: string;
};

export const MEDALS: Record<MedalsMode, MedalEntry[]> = {
    
  Race: [
    { min: 1, max: 1, medal: MedalImages.Race.First },
    { min: 2, max: 2, medal: MedalImages.Race.Second },
    { min: 3, max: 3, medal: MedalImages.Race.Third },
    { min: 4, max: 50, medal: MedalImages.Race.Top50 },
    { min: 51, max: 100, medal: MedalImages.Race.Top100 },
    { min: 0.00, max: 0.10, medal: MedalImages.Race.Top10Percent },
    { min: 0.10, max: 0.25, medal: MedalImages.Race.Top25Percent },
    { min: 0.25, max: 0.50, medal: MedalImages.Race.Top50Percent },
    { min: 0.50, max: 0.75, medal: MedalImages.Race.Top75Percent },
  ],

  Standard: [
    { min: 1, max: 1, medal: MedalImages.Boss.Standard.First },
    { min: 2, max: 2, medal: MedalImages.Boss.Standard.Second },
    { min: 3, max: 3, medal: MedalImages.Boss.Standard.Third },
    { min: 4, max: 50, medal: MedalImages.Boss.Standard.Top50 },
    { min: 51, max: 100, medal: MedalImages.Boss.Standard.Top100 },
    { min: 0.00, max: 0.10, medal: MedalImages.Boss.Standard.Top10Percent },
    { min: 0.10, max: 0.25, medal: MedalImages.Boss.Standard.Top25Percent },
    { min: 0.25, max: 0.50, medal: MedalImages.Boss.Standard.Top50Percent },
    { min: 0.50, max: 0.75, medal: MedalImages.Boss.Standard.Top75Percent },
  
  ],

  Elite: [
    { min: 1, max: 1, medal: MedalImages.Boss.Elite.First },
    { min: 2, max: 2, medal: MedalImages.Boss.Elite.Second },
    { min: 3, max: 3, medal: MedalImages.Boss.Elite.Third },
    { min: 4, max: 50, medal: MedalImages.Boss.Elite.Top50 },
    { min: 51, max: 100, medal: MedalImages.Boss.Elite.Top100 },
    { min: 0.00, max: 0.10, medal: MedalImages.Boss.Elite.Top10Percent },
    { min: 0.10, max: 0.25, medal: MedalImages.Boss.Elite.Top25Percent },
    { min: 0.25, max: 0.50, medal: MedalImages.Boss.Elite.Top50Percent },
    { min: 0.50, max: 0.75, medal: MedalImages.Boss.Elite.Top75Percent },
  ],

  Player: [
    { min: 1, max: 25, medal: MedalImages.CT.Player.Top25 },
    { min: 26, max: 100, medal: MedalImages.CT.Player.Top100 },
    { min: 0.00, max: 0.01, medal: MedalImages.CT.Player.Top1Percent },
    { min: 0.01, max: 0.10, medal: MedalImages.CT.Player.Top10Percent },
    { min: 0.10, max: 0.25, medal: MedalImages.CT.Player.Top25Percent },
    { min: 0.25, max: 0.50, medal: MedalImages.CT.Player.Top50Percent },
    { min: 0.50, max: 0.75, medal: MedalImages.CT.Player.Top75Percent },
  ],

  Team: [
    { min: 1, max: 1, medal: MedalImages.CT.Teams.First },
    { min: 2, max: 2, medal: MedalImages.CT.Teams.Second },
    { min: 3, max: 3, medal: MedalImages.CT.Teams.Third },
    { min: 4, max: 25, medal: MedalImages.CT.Teams.Top25 },
    { min: 26, max: 100, medal: MedalImages.CT.Teams.Top100 },
    { min: 0.00, max: 0.01, medal: MedalImages.CT.Teams.Top1Percent },
    { min: 0.01, max: 0.10, medal: MedalImages.CT.Teams.Top10Percent },
    { min: 0.10, max: 0.25, medal: MedalImages.CT.Teams.Top25Percent },
    { min: 0.25, max: 0.75, medal: MedalImages.CT.Teams.Top75Percent },
  ]
};