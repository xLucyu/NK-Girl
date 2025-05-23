from dataclasses import dataclass, field  
from typing import Any, List 

@dataclass 
class Tower:
    tower: str = ""
    max: int = 0
    path1NumBlockedTiers: int = 5
    path2NumBlockedTiers: int = 5
    path3NumBlockedTiers: int = 5
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
class Body:
    name: str = ""
    createdAt: int = 0
    id: str = ""
    creator: str = ""
    gameVersion: str = ""
    map: str = ""
    mapURL: str = ""
    mode: str = ""
    difficulty: str = ""
    disableDoubleCash: bool = True  
    disableInstas: bool = True  
    disableMK: bool = False 
    disablePowers: bool = True 
    disableSelling: bool = False 
    startingCash: int = 650
    abilityCooldownReductionMultiplier: float = 1.0 
    leastCashUsed: int = -1
    leastTiersUsed: int = -1
    noContinues: bool = False
    seed: int = 0
    removableCostMultiplier: float = 1.0
    roundSets: List = []
    lives: int = 150
    maxLives: int = 150
    startRound: int = 1
    endRound: int = 1 
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
    powers: List[Any] = []
    _bloonModifiers: BloonModifiers = field(default_factory=BloonModifiers) 
    _towers: Tower = field(default_factory=Tower)

@dataclass 
class MetaData:
    success: bool = True 
    body: Body = field(default_factory=Body)
