from dataclasses import dataclass 
from typing import Any, List 

@dataclass 
class Tower:
    tower: str
    max: int 
    path1NumBlockedTiers: int = 5
    path2NumBlockedTiers: int = 5
    path3NumBlockedTiers: int = 5
    isHero: bool = False 

@dataclass 
class HealthMultipliers:
    bloons: int 
    moabs: int 
    boss: int 
    
@dataclass 
class BloonModifiers:
    speedMultiplier: int
    moabSpeedMultiplier: int 
    bossSpeedMultiplier: int 
    regrowRateMultiplier: int 
    healthMultipliers: HealthMultipliers 
    allCamo: bool 
    allRegen: bool 

@dataclass 
class Body:
    name: str
    createdAt: int
    id: str
    creator: str
    gameVersion: str
    map: str
    mapURL: str
    mode: str
    difficulty: str
    disableDoubleCash: bool
    disableInstas: bool
    disableMK: bool
    disablePowers: bool
    disableSelling: bool
    startingCash: int
    abilityCooldownReductionMultiplier: int
    leastCashUsed: int
    leastTiersUsed: int
    noContinues: bool
    seed: int
    removableCostMultiplier: int
    roundSets: List 
    lives: int
    maxLives: int
    startRound: int
    endRound: int
    maxTowers: int
    maxParagons: int
    plays: int
    wins: int
    restarts: int
    losses: int
    upvotes: int
    playsUnique: int 
    winsUnique: int 
    lossesUnique: int 
    powers: List[Any] 
    _bloonModifiers: BloonModifiers 
    _towers: Tower 

@dataclass 
class MetaData:
    success: bool
    body: Body
