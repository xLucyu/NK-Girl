export const DEFAULT_TOWERS = [
  { id: "ChosenPrimaryHero", category: "Heroes" },
  { id: "Quincy", category: "Heroes" },
  { id: "Gwendolin", category: "Heroes" },
  { id: "StrikerJones", category: "Heroes" },
  { id: "ObynGreenfoot", category: "Heroes" },
  { id: "CaptainChurchill", category: "Heroes" },
  { id: "Benjamin", category: "Heroes" },
  { id: "Ezili", category: "Heroes" },
  { id: "PatFusty", category: "Heroes" },
  { id: "Adora", category: "Heroes" },
  { id: "AdmiralBrickell", category: "Heroes" },
  { id: "Etienne", category: "Heroes" },
  { id: "Sauda", category: "Heroes" },
  { id: "Psi", category: "Heroes" },
  { id: "Geraldo", category: "Heroes" },
  { id: "Corvus", category: "Heroes" },
  { id: "Rosalia", category: "Heroes" },
  { id: "Silas", category: "Heroes" },
  { id: "DartMonkey", category: "Primary" },
  { id: "BoomerangMonkey", category: "Primary" },
  { id: "BombShooter", category: "Primary" },
  { id: "TackShooter", category: "Primary" },
  { id: "IceMonkey", category: "Primary" },
  { id: "GlueGunner", category: "Primary" },
  { id: "Desperado", category: "Primary" },
  { id: "SniperMonkey", category: "Military" },
  { id: "MonkeySub", category: "Military" },
  { id: "MonkeyBuccaneer", category: "Military" },
  { id: "MonkeyAce", category: "Military" },
  { id: "HeliPilot", category: "Military" },
  { id: "MortarMonkey", category: "Military" },
  { id: "DartlingGunner", category: "Military" },
  { id: "WizardMonkey", category: "Magic" },
  { id: "SuperMonkey", category: "Magic" },
  { id: "NinjaMonkey", category: "Magic" },
  { id: "Alchemist", category: "Magic" },
  { id: "Druid", category: "Magic" },
  { id: "Mermonkey", category: "Magic" },
  { id: "Skywarden", category: "Magic" },
  { id: "BananaFarm", category: "Support" },
  { id: "SpikeFactory", category: "Support" },
  { id: "MonkeyVillage", category: "Support" },
  { id: "EngineerMonkey", category: "Support" },
  { id: "BeastHandler", category: "Support" },
]

export const API_TOWER_ORDER = [
  "Alchemist",
  "BananaFarm",
  "BombShooter",
  "BoomerangMonkey",
  "DartMonkey",
  "Druid",
  "GlueGunner",
  "HeliPilot",
  "IceMonkey",
  "MonkeyAce",
  "MonkeyBuccaneer",
  "MonkeySub",
  "MonkeyVillage",
  "NinjaMonkey",
  "SniperMonkey",
  "SpikeFactory",
  "SuperMonkey",
  "TackShooter",
  "WizardMonkey",
  "MortarMonkey",
  "EngineerMonkey",
  "DartlingGunner",
  "BeastHandler",
  "Mermonkey",
  "Desperado",
  "Skywarden"
];

export const INGAME_ORDER_RAW = Object.fromEntries(
  DEFAULT_TOWERS.map((tower, index) => [tower.id, index])
);

export const TOWER_INFO = Object.fromEntries(
  DEFAULT_TOWERS.map(tower => [tower.id, tower])
);

export const CATEGORIES = DEFAULT_TOWERS.reduce(
  (result, tower) => {
    (result[tower.category] ??= []).push(tower.id);
    return result;
  },
  {} as Record<string, string[]>
);