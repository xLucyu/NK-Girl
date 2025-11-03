from dataclasses import dataclass, field
from typing import Any, List, Optional

@dataclass
class Tower:
    tower: str = ""
    max: int = 0 
    path1NumBlockedTiers: int = 0
    path2NumBlockedTiers: int = 0 
    path3NumBlockedTiers: int = 0
    isHero: bool = False

@dataclass
class HealthMultipliers:
    bloons: float = 1.0
    moabs: float = 1.0
    boss: float = 1.0

@dataclass
class BloonModifiers:
    speedMultiplier: float = 1.0
    moabSpeedMultiplier: float = 1.0
    bossSpeedMultiplier: float = 1.0
    regrowRateMultiplier: float = 1.0
    healthMultipliers: HealthMultipliers = field(default_factory=HealthMultipliers)
    allCamo: bool = False
    allRegen: bool = False

@dataclass
class MetaBody:
    name: str = ""
    createdAt: int = 0
    id: str = ""
    creator: Optional[str] = None
    gameVersion: str = ""
    map: str = "" 
    mapURL: str = ""
    mode: str = ""
    difficulty: str = ""
    disableDoubleCash: bool = False
    disableInstas: bool = False
    disableMK: bool = False
    disablePowers: bool = False
    disableSelling: bool = False
    startingCash: int = 0
    abilityCooldownReductionMultiplier: float = 1.0
    leastCashUsed: int = 0
    leastTiersUsed: int = 0
    noContinues: bool = False
    seed: int = 0
    removeableCostMultiplier: float = 1.0
    roundSets: List[Any] = field(default_factory=list)
    lives: int = 1
    maxLives: int = 1
    startRound: int = 1
    endRound: int = 40
    maxTowers: int = 0
    maxParagons: int = 0
    plays: int = 0
    wins: int = 0
    restarts: int = 0
    losses: int = 0
    upvotes: int = 0
    playsUnique: int = 0
    winsUnique: int = 0
    lossesUnique: int = 0
    powers: List[Any] = field(default_factory=list)
    _bloonModifiers: BloonModifiers = field(default_factory=BloonModifiers)
    _towers: Optional[List[Tower]] = field(default_factory=list)

@dataclass
class MetaData:
    success: bool = False
    body: MetaBody = field(default_factory=MetaBody)
